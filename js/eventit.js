(function () {
  'use strict';

  // --- Global Declarations ---
  let currentEventItemId = null;
  let eventData = [];
  const dom = {};
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday','']
  
  // --- Constructor --
  function EventItem(title,type, card, scheduleStatus, startDate, endDate, startTime, endTime, purpose, status, repeat, repeatEndDate, subtasks, tags, id){
   this.title = title; 
   this.type = type || '';
   this.card = card || 'eventit';
   this.scheduleStatus = scheduleStatus || 'scheduled'; 
   this.startDate = startDate || '';
   this.endDate = endDate || '';
   this.startTime = startTime || '';
   this.endTime = endTime || '';
   this.purpose = purpose || ''; //rest, social, task, reflection, reward, etc.
   this.status = status || '';
   this.repeat = repeat || '';
   this.repeatEndDate = repeatEndDate || '';
   this.subtasks = subtasks || [];
   this.tags = tags || [];
   this.id = id || generateId();
  }

  // --- Helper Functions ---
  function saveAndRender() {
    saveToLocalStorage();
    renderView();
  }

  function updateSidePanel(data) {
    return false;
    console.log(data)
    currentEventItemId = data.id;
    dom.panelTitle.value = data.title;
    dom.panelService.value = data.service;
    dom.panelType.value = data.type;
    dom.panelEventing.checked = data.eventing;
    dom.panelDay.value = data.day;
    dom.panelTags.value = Array.isArray(data.tags) ? data.tags.join(', ') : data.tags || '';
  }

  function clearSidePanel() {
    updateSidePanel(new EventItem('', '', '', false, '', [], null));
  }

  function getPanelData() {
    return {
      title: dom.panelTitle.value,
      service: dom.panelService.value,
      type: dom.panelType.value,
      eventing: dom.panelEventing.checked,
      day: dom.panelDay.value,
      tags: dom.panelTags.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    };
  }

  function saveEventItem() {
    const panelData = getPanelData();

    if (currentEventItemId) {
      const existing = eventData.find(t => t.id === currentEventItemId);
      Object.assign(existing, panelData);
    } else {
      eventData.push(new EventItem(
        panelData.title,
        panelData.service,
        panelData.type,
        panelData.eventing,
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
    const newItem = new EventItem(newTitle);
    eventData.push(newItem);
    updateSidePanel(newItem);
    saveAndRender();
    showToast(`${newTitle} added`, 'success');
  }

  // --- Render Functions ---
  function renderView() {
    dom.eventView.innerHTML = '';

    if (eventData.length === 0) {
      dom.eventView.innerHTML = '<div class="no-items">Nothing to event!</div>';
      return;
    }

    eventData.sort((a, b) => {
      if (a.eventing !== b.eventing) {
        return a.eventing ? -1 : 1; // true comes before false
      }
      
     // eventData.sort((a, b) => {
        return days.indexOf(a.day) - days.indexOf(b.day);
      //});
      
      
      
      
      
      
      //return a.title.localeCompare(b.title); // A-Z by title
    });
    
    eventData.forEach(item => {
      const div = document.createElement('div');
      const typeLowerCase = item.type.toLowerCase();
      div.className = `gen-item eventit-item ${typeLowerCase} eventing-${item.eventing}`;
      div.dataset.id = item.id;
      div.onclick = () => updateSidePanel(item);

      const title = document.createElement('div');
      title.className = 'eventit-title';
      title.textContent = `${item.title}`;
      
      const service = document.createElement('div');
      service.className = 'eventit-service';
      service.textContent = `${item.service}`;
      
      const type = document.createElement('div');
      type.className = 'eventit-type';
      type.textContent = `${item.type}`;
      
      const day = document.createElement('div');
      day.className = 'eventit-type';
      day.textContent = `${item.day}`;
      
      div.appendChild(title);
      div.appendChild(service);
      div.appendChild(type);  
      div.appendChild(day);   
      
      dom.eventView.appendChild(div);
    });
  }

  // --- Save and Load ---
  function loadFromLocalStorage() {
    if (window.getPlanitSection) {
      const saved = getPlanitSection("eventit"); //planit.js
      if (saved?.shows) {
        try {
          eventData = saved.shows;
          
          //eventData.forEach(item =>{
          //  item.day = '';            
          //})
          //console.log(eventData)
          //saveToLocalStorage();
          
        } catch (e) {
          console.warn("Could not parse saved eventit data:", e);
          eventData = [];
        }
      } else {
        eventData = [
          new EventItem('Doctors Appointment'),
          new EventItem('Visit Dad')
        ];
        saveToLocalStorage();
      }
    }
  }

  function saveToLocalStorage() {
    if (window.updatePlanitSection) {
      updatePlanitSection("eventit", { shows: eventData }); //planit.js
    }
  }

  // --- Import and Export ---    
  function exportData() {
    exportCardData(eventData, 'eventit'); //planit.js     
  } 
  
  function importData(event) {
    const file = event.target.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        eventData = JSON.parse(e.target.result);
        saveAndRender();
      };
      reader.readAsText(file);
    }
  }
    
  // --- Initialization ---
  function initDomReferences() {
    dom.eventView = document.getElementById('eventView');
    dom.sidePanel = document.getElementById('sidePanel');
    dom.panelTitle = document.getElementById('title');
    dom.panelService = document.getElementById('service');
    dom.panelType = document.getElementById('type');
    dom.panelEventing = document.getElementById('eventing');
    dom.panelDay = document.getElementById('day');
    dom.panelTags = document.getElementById('tags');
    dom.titleInput = document.getElementById('titleInput');
    
    //autopanel
    dom.panelTitle?.addEventListener('input', saveEventItem); //change = final value on blur
    dom.panelService?.addEventListener('input', saveEventItem); 
    dom.panelType?.addEventListener('change', saveEventItem);   
    dom.panelEventing?.addEventListener('change', saveEventItem);
    dom.panelDay?.addEventListener('change', saveEventItem);
    dom.panelTags?.addEventListener('input', saveEventItem); 
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

  window.eventit = {
    init
  };

})();
