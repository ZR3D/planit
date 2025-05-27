(function () {
  'use strict';
   
  // --- Global Declarations ---  
  let labelData = {pages:[], currentPage:'', pageSize:''};
  let currentPageId = null;
  const dom = {};
  const paperSizes = [
    {title:'A4', width:'794px',height: '1123px'},
    {title:'Letter', width:'816px',height: '1056px'},  
  ];

  // --- Helper Functions ---
  function PageItem(title, labels, fontSize, rowNumberValue, colNumberValue, id) {
    this.title = title;
    this.labels = labels;
    this.fontSize = fontSize;
    this.rowNumber = rowNumberValue || 10;
    this.colNumber = colNumberValue || 2;
    this.id = id || generateId();
  }
  
  function addPage(){
    const pageTitle = dom.pageName.value.trim();
    if(pageTitle){
       labelData.pages.push(new PageItem(pageTitle, [], '30'));   
    }
    labelData.currentPage = pageTitle;
    saveAndRender();     
  }  

  function changePaperSize(){
    labelData.pageSize = dom.pageSizeSelect.value;
    const paperSize = paperSizes.find(p => p.title === labelData.pageSize);
    if(paperSize){
        console.log(paperSize) 
        dom.printPage.style.width =  paperSize.width;
        dom.printPage.style.height =  paperSize.height;
        saveAndRender();
    }
  }
  
  function changeFontSize(){
    labelData.pages[currentPageId].fontSize = dom.fontSizeSelect.value;
    saveAndRender()
  }
  
  function changeRowNumber(){
    labelData.pages[currentPageId].rowNumber = dom.rowNumber.value;  
    saveAndRender();
  }
  
  function changePage(){
    if(dom.pageSelect.value){
      labelData.currentPage = dom.pageSelect.value;
    }
    //labelData.currentPage = labelData.pages[0].title; //fallback
         
    currentPageId = labelData.pages.findIndex(p => p.title === labelData.currentPage) || 0;
    const thisPage = labelData.pages[currentPageId];    
    dom.rowNumber.value = thisPage.rowNumber;
    dom.colNumber.value = thisPage.colNumber;
    dom.fontSizeSelect.value = thisPage.fontSize;    
    changeColNumber(); 
  }  
  
  function changeColNumber(updateOnly){
    labelData.pages[currentPageId].colNumber = dom.colNumber.value; 
    const gridTempCols = ['', '100%', '50% 50%', '33% 33% 33%', '25% 25% 25% 25%'];
    const gtcValue = gridTempCols[dom.colNumber.value];    
    dom.printPage.style.gridTemplateColumns = gtcValue;
    saveAndRender(); 
  }

  function saveAndRender(){
    saveToLocalStorage();
    renderView();
  }
  
  function printPage(){
    window.print();    
  }
  
  function updateLabels(id){
    labelData.pages[currentPageId].labels[id] = document.getElementById('label_' + id).innerText.trim();  
    saveToLocalStorage(); //save only
  }

  function createLabel(labelText, id){
    const label = document.createElement("div");
    label.id = 'label_' + id;
    label.className = 'label';
    label.contentEditable = 'true';
    label.style.fontSize = labelData.pages[currentPageId].fontSize + 'px';
    label.spellcheck = 'true';
    label.textContent = labelText;
    label.onkeyup = () => updateLabels(id);
    return label;
  }

  function createBlankLabels(labelCount){
    const thisPage = labelData.pages[currentPageId];
    const totalLabelsOnPage = Number(thisPage.rowNumber) * Number(thisPage.colNumber);
    console.log(totalLabelsOnPage, thisPage.labels.length, thisPage.rowNumber, thisPage.colNumber)
    const fillLabelCount = totalLabelsOnPage-thisPage.labels.length;
    for(let i=0; i<fillLabelCount; i++){
      dom.printPage.appendChild(createLabel("-", labelCount));
      labelCount++;
    }  
  }

  // --- Render Functions ---
  function renderView(){  
    dom.printPage.innerHTML = '';
    
    //Populate page dropdown
    dom.pageSelect.innerHTML = '';
    labelData.pages.forEach(page => {
      const option = document.createElement("option");
      option.text = page.title;
      option.selected = (page.title===labelData.currentPage)? 'selected':'';
      dom.pageSelect.add(option);
    }); 
    
    let i=0;
    const pageTitle = (labelData.currentPage)? labelData.currentPage:dom.pageSelect.value;
    currentPageId = labelData.pages.findIndex(p => p.title === pageTitle);
    const pageData = labelData.pages[currentPageId];
    pageData.labels.forEach(labelText => {
      dom.printPage.appendChild(createLabel(labelText, i));
      i++;
    });  
    createBlankLabels(i);
  }

  // --- Save and Load ---
  function saveToLocalStorage() {
    if (window.updatePlanitSection) {
      updatePlanitSection('labelit', labelData); //planit.js
    }
  }

  function loadFromLocalStorage() {
    if (window.getPlanitSection) {
      const saved = getPlanitSection('labelit'); //planit.js
      console.log(saved)
      if (saved?.pages) {
        try {
          labelData = saved;          
        } catch (e) {
          console.warn('Could not parse saved labelit data:', e);
          //labelData.pages = [];
        }
      } else {
        labelData.currentPage = 'pantry'; 
        labelData.pageSize = 'A4';
        labelData.pages.push(new PageItem('pantry', ["Rice","Sugar","Flour","Tea"], '30'));
        labelData.pages.push(new PageItem('workshop',["Screws","Bolts","Washers"], '32'));        
      }
    }
  }

  // --- Import and Export ---    
  function exportData() {
    exportCardData(labelData, 'labelit'); //planit.js     
  } 
  
  function importData(event) {
    const file = event.target.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        //check structure
        labelData = JSON.parse(e.target.result);
        saveAndRender();
      };
      reader.readAsText(file);
    }
  }

  // --- Start Font ---
  function detectFont(font) {
    const testString = "abcdefghijklmnopqrstuvwxyz0123456789";
    const testSize = "72px";

    const baseFonts = ["monospace", "sans-serif", "serif"];
    const body = document.body;

    const span = document.createElement("span");
    span.style.fontSize = testSize;
    span.innerHTML = testString;
    span.style.position = "absolute";
    span.style.left = "-9999px";

    const defaultWidths = {};

    baseFonts.forEach(base => {
      span.style.fontFamily = base;
      body.appendChild(span);
      defaultWidths[base] = span.offsetWidth;
      body.removeChild(span);
    });

    for (let base of baseFonts) {
      span.style.fontFamily = `${font},${base}`;
      body.appendChild(span);
      const width = span.offsetWidth;
      body.removeChild(span);
      if (width !== defaultWidths[base]) return true;
    }
    return false;
  }

  const fontList = [
    "Arial", "Verdana", "Tahoma", "Trebuchet MS", "Times New Roman", "Georgia", "Inter", 
    "Garamond", "Courier New", "Brush Script MT", "Comic Sans MS", "Impact", "Lucida Console"
  ];

  const select = document.getElementById("fontSelect");
  fontList.forEach(font => {
    if (detectFont(font)) {
      const option = document.createElement("option");
      option.value = font;
      option.textContent = font;
      option.style.fontFamily = font;
      select.appendChild(option);
    }
  });

  select.addEventListener("change", (e) => {
    document.querySelectorAll(".label").forEach(el => {
      el.style.fontFamily = e.target.value;
    });  
  });

  // --- Initialization ---
  function initDomReferences() {
    dom.sidePanel = document.getElementById('sidePanel');
    dom.printPage = document.getElementById('printPage');
    dom.pageSelect = document.getElementById('pageSelect');
    dom.pageSelect?.addEventListener('change', changePage);
    dom.pageSizeSelect = document.getElementById('pageSizeSelect');
    dom.pageSizeSelect?.addEventListener('change', changePaperSize);
    dom.fontSizeSelect = document.getElementById('fontSizeSelect');
    dom.fontSizeSelect?.addEventListener('change', changeFontSize);
    dom.rowNumber = document.getElementById('rowNumber');
    dom.rowNumber?.addEventListener('change', changeRowNumber);
    dom.colNumber = document.getElementById('colNumber');
    dom.colNumber?.addEventListener('change', changeColNumber)
    dom.pageName = document.getElementById('pageName');    
  }
  
  function initButtons(){
    dom.page?.addEventListener('onkeyup', saveToLocalStorage);
    document.getElementById('toggleButton')?.addEventListener('click', toggleSidePanel); 
    document.getElementById('printButton')?.addEventListener('click', printPage);
    document.getElementById('addPageButton')?.addEventListener('click', addPage);
  } 
    
  function init(){
    initDomReferences();
    loadFromLocalStorage(); 
    initButtons(); 
    changePage();
    changePaperSize();
  }

  init();

  window.labelit = {
    init
  };


})();
