(function () {
  'use strict';
   
  // --- Global Declarations ---
  let toastTimeout;
  let currentCard;
  const dom = {};
  
  const cardNameList = ['viewit','taskit','shopit','menuit','recipeit','watchit','readit','listenit','gameit','buildit','growit','labelit','affirmit','noteit','eventit','studyit'];  
  let planitData = {
    settings: {
      theme: "dark",
      customTheme: {} 
    }
  };
  
  console.log(planitData.settings.customTheme, planitData.settings.customTheme['--color-bg']); //planitData.customTheme
  
  // --- Render Functions ---
  function renderNavButtons(){    
    cardNameList.forEach(cardName => {    
      const button = document.createElement("button");
      button.className = "nav-button";
      button.dataset.name = cardName;       
      const svg = createSvg(`${cardName}Icon`, 'nav-icon');      
      const buttonText = document.createElement("div");
      buttonText.textContent =  cardName[0].toUpperCase() + cardName.slice(1).toLowerCase();       
      button.appendChild(svg);
      button.appendChild(buttonText);
      button.onclick = () => loadView(cardName);
      dom.navigationButtons.appendChild(button)
    });  
  }
  // --- Helper Functions ---
  function loadView(cardname) {
    currentCard = cardname;
    fetch(`components/${cardname}.html`)
      .then(res => res.text())
      .then(html => {
        document.getElementById('main').innerHTML = html;
        loadScript(`js/${cardname}.js`,cardname);
      })
      .catch(err => {
        document.getElementById('main').innerHTML = '<p>Error loading view.</p>';
        console.error(err);
      });
    showToast(cardname + " loaded", 'success');  
    highlightActiveButton(cardname);
  }

  function highlightActiveButton(cardname) {
    const buttons = document.querySelectorAll('.nav-button');
    buttons.forEach(btn => {
      if (btn.dataset.name === cardname) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function loadScript(scriptUrl, cardname) {
    const existingScript = document.querySelector(`script[data-card="${cardname}"]`); 
    if (!existingScript) {
      //existingScript.remove(); // prevent duplicates
      //console.log(cardname + " js exists")
    
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.dataset.card = cardname;
    script.defer = true;
    document.body.appendChild(script);
    }else{    
    if(window[cardname]?.init) {
      window[cardname].init();
    }else{
     console.log('no init in card '+ cardname);
    }   
    }
  }

  function toggleTheme() {
    /*const root = document.documentElement;
    const current = root.getAttribute('data-theme');
    root.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
   // document.getElementById("themeText").innerHTML =  (current === 'light' ? "🌙":"☀️");*/ 
  }
  
  
  function toggleNavVisibility(val){
    const display = (dom.navigationButtons.style.display==='flex')? 'none':'flex';
    dom.navigationButtons.style.display = display; 
  }
  

  function openFullscreen() {
    if (dom.doc.requestFullscreen) {
       dom.doc.requestFullscreen();
    } else if (dom.doc.webkitRequestFullscreen) { /* Safari */
       dom.doc.webkitRequestFullscreen();
    } else if ( dom.doc.msRequestFullscreen) { /* IE11 */
       dom.doc.msRequestFullscreen();
    }
  }

  function closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
      document.msExitFullscreen();
    }
  }
    
  function toggleFullscreen() {
    console.log('test', window.screenTop, window.screenY)
    if (document.fullscreenElement) {
      console.log('is full screen');
      closeFullscreen();
    }else{
      openFullscreen();
      console.log('is not full screen');
    }
  }
  
  
  
  
  function timeStamp(){
    return Date.now();
  }  
  
  function updateTheme(themeName, variables) {
   for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        if (rule.selectorText === `[data-theme="${themeName}"]`) {
          //console.log(rule.cssText)
          for (const [varName, value] of Object.entries(variables)) {
            rule.style.setProperty(varName, value);
          }
          return true;
        }
      }
    } catch (e) {
      console.warn("Stylesheet access error:", e);
    }
  }
  return false;
    /*
    let styleTag = document.querySelector(`style[data-generated-theme="${themeName}"]`);

    const cssVars = Object.entries(variables)
      .map(([key, val]) => `  ${key}: ${val};`)
      .join('\n');

    const cssRule = `[data-theme="${themeName}"] {\n${cssVars}\n}`;

    if (styleTag) {
      styleTag.textContent = cssRule;
      console.log("is-style")
    } else {
      styleTag = document.createElement('style');
      styleTag.setAttribute('data-generated-theme', themeName);
      styleTag.textContent = cssRule;
      document.head.appendChild(styleTag);
    }
    */
  }
  
  
 
  function addLettersOneByOne(targetElement, text, delay) {
    let index = 0;
    function addNextLetter() {
      if (index < text.length) {
        const letter = text.charAt(index);
        targetElement.textContent += letter;
        index++;
        let writeDelay = (letter===' ')? (delay*4):delay 
        setTimeout(addNextLetter, writeDelay);
      }
    }
    addNextLetter();
  }

  function showToast(message, type = 'info', duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = '';
    addLettersOneByOne(toast, message, 50);
    toast.className = `toast show ${type}`  
    // Clear any existing timeout and start a fresh one
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }
  
  function showTailwindColors(){
    dom.tailwindColors.innerHTML = '';
    const wedgewood =  {
      '50': '#f5f7fa',
      '100': '#e9eff5',
      '200': '#cfdde8',
      '300': '#a4bfd5',
      '400': '#739dbd',
      '500': '#5180a4', // base colour
      '600': '#3f688a',
      '700': '#345470',
      '800': '#2e475e',
      '900': '#2a3d50',
      '950': '#1c2835',
    }
      
    for (let key in wedgewood) {
      console.log(wedgewood[key]);    
      const div = document.createElement('div');
      div.style.background = wedgewood[key];
      div.textContent = key;    
      dom.tailwindColors.appendChild(div);
    }

    tailwindColors.classList.toggle('planit-hidden');

  }
  

  // Save entire planitData to localStorage
  function savePlanitData() {
    localStorage.setItem("planitData", JSON.stringify(planitData));
  }

  // Load entire planitData from localStorage
  function loadPlanitData() {
    const data = localStorage.getItem("planitData");
    if (data) {
      const parsed = JSON.parse(data);
      Object.assign(planitData, parsed); // merge without losing reference
    }
  }
    
  function importPlanitData(event) {
    const file = event.target.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log(JSON.parse(e.target.result))
        planitData = JSON.parse(e.target.result);
        savePlanitData();
        loadView('viewit');
      };
      reader.readAsText(file);
    }
  }
  
  function exportPlanitData(){
    exportCardData(planitData, 'planit')   
  }
  
  function exportCardData(data, cardName) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cardName}-data-${formatDate()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Update a section (e.g., 'taskit') of planitData and save
  function updatePlanitSection(sectionName, newData) {
    planitData[sectionName] = newData;
    savePlanitData();
  }

  // Optional: get a section (with fallback)
  function getPlanitSection(sectionName) {
    return planitData[sectionName] || {};
  }

  function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay(), diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  function formatDate(date) { //toLocalDateString
    date = date || new Date();    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function generateId() {
    return Math.random().toString(36).substr(2, 9);
  } 
  
  function createSvg(iconName, className) {
    const svgns = 'http://www.w3.org/2000/svg';
    const svg =  document.createElementNS(svgns,'svg');
    svg.className.baseVal = className;
    const use = document.createElementNS(svgns,'use');
    use.href.baseVal = `#${iconName}`;
    svg.appendChild(use);
    return svg;
  } 

  function toggleSidePanel(){
      console.log(currentCard);
      document.getElementById('sidePanel')?.classList.toggle('card-side-panel-collapsed');
      toggleButton.classList.toggle('side-panel-toggle-button-hide');  
  }

/*
  function setupNavButtons() {
  //console.log("button setup")  
    const buttons = document.querySelectorAll('.nav-button');
    buttons.forEach(button => {
      const viewName = button.dataset.name;
      if (viewName) {
        button.addEventListener('click', () => loadView(viewName));
      }
    });
  }
 */ 
  
  // --- Service Worker ---
  function initServiceWorker(){
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
      .register("/service-worker.js")
      .then(reg => console.log("Service Worker registered:", reg.scope))
      .catch(err => console.error("Service Worker registration failed:", err));
    }
  }
  
  function openModal() {
    document.getElementById('modalBackdrop').style.display = 'flex';
  }

  function closeModal() {
    document.getElementById('modalBackdrop').style.display = 'none';
  }

  // --- Expose Only Required Functions ---
  window.toggleSidePanel = toggleSidePanel;
  window.generateId = generateId;
  window.formatDate = formatDate;
  window.getMonday = getMonday;
  window.showToast = showToast;
  window.updatePlanitSection = updatePlanitSection;
  window.getPlanitSection = getPlanitSection;
  window.exportCardData = exportCardData;
  window.createSvg = createSvg;
  window.toggleTheme = toggleTheme;
  window.exportPlanitData = exportPlanitData;
  window.importPlanitData = importPlanitData;
  window.loadView = loadView;
  window.openModal = openModal;
  window.closeModal = closeModal;
  window.showTailwindColors = showTailwindColors;
  window.updateTheme = updateTheme;
  window.toggleFullscreen = toggleFullscreen;

  // --- Initialization ---
  function initDomReferences() {
    dom.doc = document.documentElement;
    //dom.navigationBar = document.getElementById('navigationBar');
    dom.navigationButtons = document.getElementById('navigationButtons');
    dom.tailwindColors = document.getElementById('tailwindColors');
    dom.navigationButtons = document.getElementById('navigationButtons');
    
        
    // Optional: close with ESC
    document.addEventListener('keydown', function(e) {
      if (e.key === "Escape") closeModal();
    }); 
  }

  function initButtons() {
    //document.getElementById('toggleButton')?.addEventListener('click', toggleSidePanel);
    //document.addEventListener('DOMContentLoaded', setupNavButtons);
    document.getElementById('xCloseModalButton')?.addEventListener('click', closeModal);
    document.getElementById('okCloseModalButton')?.addEventListener('click', closeModal);
    document.getElementById('showNavigationButton')?.addEventListener('click', toggleNavVisibility);
    
  }

  function init() {
    initDomReferences();
    renderNavButtons();
    initButtons();    
    loadPlanitData();
    loadView('viewit');
    //initServiceWorker();

  
    console.log(timeStamp());
    
 
    
    
    
  }

init();

})();
