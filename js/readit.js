(function () {
  'use strict';

  // --- Global Declarations ---
  let currentReadItemId = null;
  let readData = [];

  const dom = {};

  // --- Constructor Functions ---
  function ReadItem(title, author, genre, reading, tags, id) {
    this.title = title;
    this.author = author;
    this.genre = genre;
    this.reading = reading;
    this.tags = tags;
    this.id = id || generateId(); //planit.js
  }
  
  // --- Helper Functions ---
  function saveAndRender() {
    saveToLocalStorage();
    renderView();
  }

  function updateSidePanel(data) {
    currentReadItemId = data.id;
    dom.panelTitle.value = data.title;
    dom.panelAuthor.value = data.author;
    dom.panelGenre.value = data.genre;
    dom.panelReading.checked = data.reading;
    dom.panelTags.value = Array.isArray(data.tags) ? data.tags.join(', ') : data.tags || '';
  }

  function clearSidePanel() {
    updateSidePanel(new ReadItem('', '', '', false, [], null));
  }

  function getPanelData() {
    return {
      title: dom.panelTitle.value,
      author: dom.panelAuthor.value,
      genre: dom.panelGenre.value,
      reading: dom.panelReading.checked,
      tags: dom.panelTags.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    };
  }

  function saveReadItem() {
    const panelData = getPanelData();

    if (currentReadItemId) {
      const existing = readData.find(t => t.id === currentReadItemId);
      Object.assign(existing, panelData);
    } else {
      readData.push(new ReadItem(
        panelData.title,
        panelData.author,
        panelData.genre,
        panelData.reading,
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
    const newItem = new ReadItem(newTitle, '', '', false, [], null);
    readData.push(newItem);
    updateSidePanel(newItem);
    saveAndRender();
    showToast(`${newTitle} added`, 'success');
  }

  // --- Render Functions ---
  function renderView() {
    dom.readView.innerHTML = '';
    
    readData.sort((a, b) => {
      if (a.reading !== b.reading) {
        return a.reading ? -1 : 1; // true comes before false
      }
      return a.title.localeCompare(b.title); // A-Z by title
    });

    if (readData.length === 0) {
      dom.readView.innerHTML = '<div class="no-items">Nothing to read!</div>';
      return;
    }

    readData.forEach(item => {
      const div = document.createElement('div');
      div.className = `gen-item readit-item ${item.genre.toLowerCase()} reading-${item.reading}`;
      div.dataset.id = item.id;
      div.onclick = () => updateSidePanel(item);

      const title = document.createElement('div');
      title.className = 'readit-title';
      title.textContent = item.title;
      
      const author = document.createElement('div');
      author.className = 'readit-author';
      author.textContent = `${item.author}`;
      
      const genre = document.createElement('div');
      genre.className = 'readit-genre';
      genre.textContent = `${item.genre}`;

      div.appendChild(title);
      div.appendChild(author);
      div.appendChild(genre);
      
      dom.readView.appendChild(div);
    });
  }

  // --- Save and Load ---
  function loadFromLocalStorage() {
    if (window.getPlanitSection) {
      const saved = getPlanitSection("readit");
      if (saved?.books) {
        try {
          readData = saved.books;
        } catch (e) {
          console.warn("Could not parse saved readit data:", e);
          readData = [];
        }
      } else {
        readData = [
          new ReadItem('The Hobbit', 'J.R.R. Tolkien', 'Fantasy', false, []),
          new ReadItem('Sapiens', 'Yuval Noah Harari', 'Nonfiction', true, [])
        ];
        saveToLocalStorage();
      }
    }
  }

  function saveToLocalStorage() {
    if (window.updatePlanitSection) {
      updatePlanitSection("readit", { books: readData });
    }
  }
  
  // --- Import and Export ---    
  function exportData() {
    exportCardData(readData, 'readit'); //planit.js     
  } 
  
  function importData(event) {
    const file = event.target.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        readData = JSON.parse(e.target.result);
        saveAndRender();
      };
      reader.readAsText(file);
    }
  }

  // --- Initialization ---
  function initDomReferences() {
    dom.readView = document.getElementById('readView');
    dom.sidePanel = document.getElementById('sidePanel');
    dom.panelTitle = document.getElementById('title');
    dom.panelAuthor = document.getElementById('author');
    dom.panelGenre = document.getElementById('genre');
    dom.panelReading = document.getElementById('reading');
    dom.panelTags = document.getElementById('tags');
    dom.titleInput = document.getElementById('titleInput');
  }

  function initButtons() {
    document.getElementById('toggleButton')?.addEventListener('click', toggleSidePanel);
    document.getElementById('addNewButton')?.addEventListener('click', startNew);
    document.getElementById('saveButton')?.addEventListener('click', saveReadItem);
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

  window.readit = {
    init
  };

})();
