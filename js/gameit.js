(function () {
  'use strict';

  // --- Global Declarations ---
  let currentGameItemId = null;
  let gameData = [];
  const dom = {};

  // --- Helper Functions ---
  function saveAndRender() {
    saveToLocalStorage();
    renderView();
  }
  
  function GameItem(title, platform, genre, playing, tags, id) {
    this.title = title;
    this.platform = platform;
    this.genre = genre;
    this.playing = playing;
    this.tags = tags;
    this.id = id || generateId();
  }

  function updateSidePanel(data) {
    currentGameItemId = data.id;
    dom.panelTitle.value = data.title;
    dom.panelPlatform.value = data.platform;
    dom.panelGenre.value = data.genre;
    dom.panelPlaying.checked = data.playing;
    dom.panelTags.value = Array.isArray(data.tags) ? data.tags.join(', ') : data.tags || '';
  }

  function clearSidePanel() {
    updateSidePanel(new GameItem('', '', '', false, [], null));
  }

  function getPanelData() {
    return {
      title: dom.panelTitle.value,
      platform: dom.panelPlatform.value,
      genre: dom.panelGenre.value,
      playing: dom.panelPlaying.checked,
      tags: dom.panelTags.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    };
  }

  function saveGameItem() {
    const panelData = getPanelData();

    if (currentGameItemId) {
      const existing = gameData.find(t => t.id === currentGameItemId);
      Object.assign(existing, panelData);
    } else {
      gameData.push(new GameItem(
        panelData.title,
        panelData.platform,
        panelData.genre,
        panelData.playing,
        panelData.tags,
        null
      ));
    }

    saveAndRender();
    showToast(`${panelData.title} updated`, 'success');
  }

  function startNew() {
    const newTitle = dom.titleInput.value.trim();
    if (!newTitle) {
      showToast("Please enter a title first.", 'error');
      return;
    }

    const newItem = new GameItem(newTitle, '', '', false, [], null);
    gameData.push(newItem);
    updateSidePanel(newItem);

    saveAndRender();
    showToast(`${newTitle} added`, 'success');
  }

  // --- Render Functions ---
  function renderView() {
    dom.gameView.innerHTML = '';
    
    gameData.sort((a, b) => {
      if (a.playing !== b.playing) {
        return a.playing ? -1 : 1; // true comes before false
      }
      return a.title.localeCompare(b.title); // A-Z by title
    });

    if (gameData.length === 0) {
      dom.gameView.innerHTML = '<div class="no-items">Nothing to play!</div>';
      return;
    }

    gameData.forEach(item => {
      const div = document.createElement('div');
      div.className = `gen-item gameit-item ${item.genre.toLowerCase()} playing-${item.playing}`;
      div.dataset.id = item.id;
      div.onclick = () => updateSidePanel(item);

      const title = document.createElement('div');
      title.className = 'gameit-title';
      title.textContent = item.title;
      
      const platform = document.createElement('div');
      platform.className = 'gameit-platform';
      platform.textContent = `${item.platform}`;
      
      const genre = document.createElement('div');
      genre.className = 'gameit-genre';
      genre.textContent = `${item.genre}`;
 
      div.appendChild(title);
      div.appendChild(platform);
      div.appendChild(genre);
            
      dom.gameView.appendChild(div);
    });
  }

  // --- Save and Load ---
  function loadFromLocalStorage() {
    if (window.getPlanitSection) {
      const saved = getPlanitSection("gameit");
      if (saved?.games) {
        try {
          gameData = saved.games;
        } catch (e) {
          console.warn("Could not parse saved gameit data:", e);
          gameData = [];
        }
      } else {
        gameData = [
          new GameItem('Chess', 'Web', 'Strategy', true, ['chess.com']),
          new GameItem('Minecraft', 'PC', 'Sandbox', true, ['survival'])            
        ];
        saveToLocalStorage();
      }
    }
  }

  function saveToLocalStorage() {
    if (window.updatePlanitSection) {
      updatePlanitSection("gameit", { games: gameData });
    }
  }
  
  // --- Import and Export ---    
  function exportData() {
    exportCardData(gameData, 'gameit'); //planit.js     
  } 
  
  function importData(event) {
    const file = event.target.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        gameData = JSON.parse(e.target.result);
        saveAndRender();
      };
      reader.readAsText(file);
    }
  }

  // --- Initialization ---
  function initDomReferences() {
    dom.gameView = document.getElementById('gameView');
    dom.sidePanel = document.getElementById('sidePanel');
    dom.panelTitle = document.getElementById('title');
    dom.panelPlatform = document.getElementById('platform');
    dom.panelGenre = document.getElementById('genre');
    dom.panelPlaying = document.getElementById('playing');
    dom.panelTags = document.getElementById('tags');
    dom.titleInput = document.getElementById('titleInput');
  }

  function initButtons() {
    document.getElementById('toggleButton')?.addEventListener('click', toggleSidePanel);
    document.getElementById('addNewButton')?.addEventListener('click', startNew);
    document.getElementById('saveButton')?.addEventListener('click', saveGameItem);
    document.getElementById('exportDataButton')?.addEventListener('click', exportData);

    //Import Json Data
    const importDataButton = document.getElementById('importDataButton');
    const hiddenFileInput = document.getElementById('hiddenFileInput');
    importDataButton?.addEventListener("click", () => hiddenFileInput?.click());
    hiddenFileInput?.addEventListener("change", importData);
  }

  function init() {
    initDomReferences();
    loadFromLocalStorage();
    initButtons();
    renderView();
  }

  init();

  window.gameit = {
    init
  };

})();
