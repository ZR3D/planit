(function () {
  'use strict';

  // --- Global Declarations ---
  let currentListenItemId = null;
  let listenData = [];
  const dom = {};

  // --- Constructor Functions ---
  function ListenItem(title, creator, medium, listening, tags, id) {
    this.title = title;
    this.creator = creator;
    this.medium = medium;
    this.listening = listening;
    this.tags = tags;
    this.id = id || generateId();
  }

  // --- Helper Functions ---
  function saveAndRender() {
    saveToLocalStorage();
    renderView();
  }

  function updateSidePanel(data) {
    currentListenItemId = data.id;
    dom.panelTitle.value = data.title;
    dom.panelCreator.value = data.creator;
    dom.panelMedium.value = data.medium;
    dom.panelListening.checked = data.listening;
    dom.panelTags.value = Array.isArray(data.tags) ? data.tags.join(', ') : data.tags || '';
  }

  function clearSidePanel() {
    updateSidePanel(new ListenItem('', '', '', false, [], null));
  }

  function getPanelData() {
    return {
      title: dom.panelTitle.value,
      creator: dom.panelCreator.value,
      medium: dom.panelMedium.value,
      listening: dom.panelListening.checked,
      tags: dom.panelTags.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    };
  }

  function saveListenItem() {
    const panelData = getPanelData();

    if (currentListenItemId) {
      const existing = listenData.find(t => t.id === currentListenItemId);
      Object.assign(existing, panelData);
    } else {
      listenData.push(new ListenItem(
        panelData.title,
        panelData.creator,
        panelData.medium,
        panelData.listening,
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

    const newItem = new ListenItem(newTitle, '', '', false, [], null);
    listenData.push(newItem);
    updateSidePanel(newItem);

    saveAndRender();
    showToast(`${newTitle} added`, 'success');
  }

  // --- Render Functions ---
  function renderView() {
    dom.listenView.innerHTML = '';
        
    listenData.sort((a, b) => {
      if (a.listening !== b.listening) {
        return a.listening ? -1 : 1; // true comes before false
      }
      return a.title.localeCompare(b.title); // A-Z by title
    });

    if (listenData.length === 0) {
      dom.listenView.innerHTML = '<div class="no-items">Nothing to listen!</div>';
      return;
    }

    listenData.forEach(item => {
      const div = document.createElement('div');
      div.className = `gen-item listenit-item ${item.medium.toLowerCase} listening-${item.listening}`;
      div.dataset.id = item.id;
      div.onclick = () => updateSidePanel(item);

      const title = document.createElement('div');
      title.className = 'listenit-title';
      title.textContent = item.title;
      
      const creator = document.createElement('div');
      creator.className = 'listenit-creator';
      creator.textContent = `${item.creator}`;
      
      const medium = document.createElement('div');
      medium.className = 'listenit-medium';
      medium.textContent = `${item.medium}`;
 
      div.appendChild(title);
      div.appendChild(creator);
      div.appendChild(medium);
      
      dom.listenView.appendChild(div);
    });
  }

  // --- Save and Load ---
  function loadFromLocalStorage() {
    if (window.getPlanitSection) {
      const saved = getPlanitSection("listenit");
      if (saved?.audio) {
        try {
          listenData = saved.audio;
        } catch (e) {
          console.warn("Could not parse saved listenit data:", e);
          listenData = [];
        }
      } else {
        listenData = [
          new ListenItem('Ready Player One', 'Ernest Cline', 'Audiobook', true, ['sci-fi']),
          new ListenItem('That UFO Podcast', 'Andy McGrillen', 'Podcast', true, ['ufos','aliens','men in black'])
        ];
        saveToLocalStorage();
      }
    }
  }

  function saveToLocalStorage() {
    if (window.updatePlanitSection) {
      updatePlanitSection("listenit", { audio: listenData });
    }
  }

  // --- Import and Export ---    
  function exportData() {
    exportCardData(listenData, 'listenit'); //planit.js     
  } 
  
  function importData(event) {
    const file = event.target.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        listenData = JSON.parse(e.target.result);
        saveAndRender();
      };
      reader.readAsText(file);
    }
  }
  
  // --- Initialization ---
  function initDomReferences() {
    dom.listenView = document.getElementById('listenView');
    dom.sidePanel = document.getElementById('sidePanel');
    dom.panelTitle = document.getElementById('title');
    dom.panelCreator = document.getElementById('creator');
    dom.panelMedium = document.getElementById('medium');
    dom.panelListening = document.getElementById('listening');
    dom.panelTags = document.getElementById('tags');
    dom.titleInput = document.getElementById('titleInput');
  }

  function initButtons() {
    document.getElementById('toggleButton')?.addEventListener('click', toggleSidePanel);
    document.getElementById('addNewButton')?.addEventListener('click', startNew);
    document.getElementById('saveButton')?.addEventListener('click', saveListenItem);
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

  window.listenit = {
    init
  };

})();
