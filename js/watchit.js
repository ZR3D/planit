(function () {
  'use strict';

  // --- Global Declarations ---
  let currentWatchItemId = null;
  let watchData = [];
  const dom = {};
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday','']
  
  // --- Constructor Functions --- 
  function WatchItem(title, service, type, watching, day, tags, id) {
    this.title = title;
    this.service = service;
    this.type = type;
    this.watching = watching;
    this.day = day;
    this.tags = tags;
    this.id = id || generateId(); //planit.js
  }  

  // --- Helper Functions ---
  function saveAndRender() {
    saveToLocalStorage();
    renderView();
  }

  function updateSidePanel(data) {
    console.log(data)
    currentWatchItemId = data.id;
    dom.panelTitle.value = data.title;
    dom.panelService.value = data.service;
    dom.panelType.value = data.type;
    dom.panelWatching.checked = data.watching;
    dom.panelDay.value = data.day;
    dom.panelTags.value = Array.isArray(data.tags) ? data.tags.join(', ') : data.tags || '';
  }

  function clearSidePanel() {
    updateSidePanel(new WatchItem('', '', '', false, '', [], null));
  }

  function getPanelData() {
    return {
      title: dom.panelTitle.value,
      service: dom.panelService.value,
      type: dom.panelType.value,
      watching: dom.panelWatching.checked,
      day: dom.panelDay.value,
      tags: dom.panelTags.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    };
  }

  function saveWatchItem() {
    const panelData = getPanelData();

    if (currentWatchItemId) {
      const existing = watchData.find(t => t.id === currentWatchItemId);
      Object.assign(existing, panelData);
    } else {
      watchData.push(new WatchItem(
        panelData.title,
        panelData.service,
        panelData.type,
        panelData.watching,
        panelData.day,
        panelData.tags,
        null
      ));
    }

    saveAndRender();
    //showToast(`${panelData.title} updated`, 'success');
  }

  function startNew() {
    const newTitle = dom.titleInput.value.trim();
    if (!newTitle) {
      showToast("Please enter a title first.", 'error');
      return;
    }
    const newItem = new WatchItem(newTitle, '', '', false, 'Monday', [], null);
    watchData.push(newItem);
    updateSidePanel(newItem);
    saveAndRender();
    showToast(`${newTitle} added`, 'success');
  }

  // --- Render Functions ---
  function renderView() {
    dom.watchView.innerHTML = '';

    if (watchData.length === 0) {
      dom.watchView.innerHTML = '<div class="no-items">Nothing to watch!</div>';
      return;
    }

    watchData.sort((a, b) => {
      if (a.watching !== b.watching) {
        return a.watching ? -1 : 1; // true comes before false
      }
      
     // watchData.sort((a, b) => {
        return days.indexOf(a.day) - days.indexOf(b.day);
      //});
      
      
      
      
      
      
      //return a.title.localeCompare(b.title); // A-Z by title
    });
    
    watchData.forEach(item => {
      const div = document.createElement('div');
      const typeLowerCase = item.type.toLowerCase();
      div.className = `gen-item watchit-item ${typeLowerCase} watching-${item.watching}`;
      div.dataset.id = item.id;
      div.onclick = () => updateSidePanel(item);

      const title = document.createElement('div');
      title.className = 'watchit-title';
      title.textContent = `${item.title}`;
      
      const service = document.createElement('div');
      service.className = 'watchit-service';
      service.textContent = `${item.service}`;
      
      const type = document.createElement('div');
      type.className = 'watchit-type';
      type.textContent = `${item.type}`;
      
      const day = document.createElement('div');
      day.className = 'watchit-type';
      day.textContent = `${item.day}`;
      
      div.appendChild(title);
      div.appendChild(service);
      div.appendChild(type);  
      div.appendChild(day);   
      
      dom.watchView.appendChild(div);
    });
  }

  // --- Save and Load ---
  function loadFromLocalStorage() {
    if (window.getPlanitSection) {
      const saved = getPlanitSection("watchit"); //planit.js
      if (saved?.shows) {
        try {
          watchData = saved.shows;
          
          //watchData.forEach(item =>{
          //  item.day = '';            
          //})
          //console.log(watchData)
          //saveToLocalStorage();
          
        } catch (e) {
          console.warn("Could not parse saved watchit data:", e);
          watchData = [];
        }
      } else {
        watchData = [
          new WatchItem('Severance', 'Apple+', 'Series', true, 'Monday', []),
          new WatchItem('Blade Runner', 'Max', 'Movie', false, 'Monday',[])
        ];
        saveToLocalStorage();
      }
    }
  }

  function saveToLocalStorage() {
    if (window.updatePlanitSection) {
      updatePlanitSection("watchit", { shows: watchData }); //planit.js
    }
  }

  // --- Import and Export ---    
  function exportData() {
    exportCardData(watchData, 'watchit'); //planit.js     
  } 
  
  function importData(event) {
    const file = event.target.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        watchData = JSON.parse(e.target.result);
        saveAndRender();
      };
      reader.readAsText(file);
    }
  }
    
  // --- Initialization ---
  function initDomReferences() {
    dom.watchView = document.getElementById('watchView');
    dom.sidePanel = document.getElementById('sidePanel');
    dom.panelTitle = document.getElementById('title');
    dom.panelService = document.getElementById('service');
    dom.panelType = document.getElementById('type');
    dom.panelWatching = document.getElementById('watching');
    dom.panelDay = document.getElementById('day');
    dom.panelTags = document.getElementById('tags');
    dom.titleInput = document.getElementById('titleInput');
    
    //autopanel
    dom.panelTitle?.addEventListener('input', saveWatchItem); //change = final value on blur
    dom.panelService?.addEventListener('input', saveWatchItem); 
    dom.panelType?.addEventListener('change', saveWatchItem);   
    dom.panelWatching?.addEventListener('change', saveWatchItem);
    dom.panelDay?.addEventListener('change', saveWatchItem);
    dom.panelTags?.addEventListener('input', saveWatchItem); 
  }

  function initButtons() {
    document.getElementById('toggleButton')?.addEventListener('click', toggleSidePanel);
    document.getElementById('addNewButton')?.addEventListener('click', startNew);

    //Import Export Json Data
    document.getElementById('exportDataButton')?.addEventListener('click', exportData);
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

  window.watchit = {
    init
  };

})();
