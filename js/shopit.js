(function () {
  'use strict';

  // --- Global Declarations ---
  let shopData = [];
  let menuPlanData = [];
  let uniqueIngredients = []; 
  let currentShopItemId = null;
  let currentMonday = getMonday(new Date());
  const itemInput = document.getElementById('itemInput');
  const matchDisplay = document.getElementById('matchDisplay');
  const dom = {};

  // --- Helper Functions ---
  function saveAndRender() {
    saveToLocalStorage();
    renderView();
  }
  
  function ShopItem(title, cat, subCat, order, tags, id) {
    this.title = title;
    this.cat = cat;
    this.subCat = subCat;
    this.order = order || false;
    this.tags = tags || [];
    this.id = id || generateId(); //planit.js
  }
  
  function updateSidePanel(data) {
    currentShopItemId = data.id;
    dom.panelTitle.value = data.title;
    dom.panelCat.value = data.cat;
    dom.panelSubCat.value = data.subCat;
    dom.panelOrder.checked = data.order;
    dom.panelTags.value = Array.isArray(data.tags) ? data.tags.join(', ') : data.tags || '';
  }
  
  function clearSidePanel() {
    updateSidePanel(new ShopItem('', '', '', false, [], null));
    currentShopItemId = null;
  }

  function getPanelData() {
    return new ShopItem(
        dom.panelTitle.value,
        dom.panelCat.value,
        dom.panelSubCat.value,
        dom.panelOrder.checked,
        dom.panelTags.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        currentShopItemId
      );    
  }

  function saveShopItem() {
    const panelData = getPanelData();
    console.log(panelData)
    if (currentShopItemId) {
      const existing = shopData.find(t => t.id === currentShopItemId);
      Object.assign(existing, panelData);
    } else {
      shopData.push(panelData);
    }
    saveAndRender();
  }
  

  function deleteShopItem() {
    //showToast(`task: ${task.title} deleted`, 'success');   
    shopData = shopData.filter(t => !(t.id === currentShopItemId));
    saveAndRender();
  }  

  
  function sortItems(a, b) {
    if (a.subCat !== b.subCat) return a.subCat.localeCompare(b.subCat);
    return a.title.localeCompare(b.title);
  }
  
  function addItem() { //from top
    const title = itemInput.value.trim();
    const cat = document.getElementById('catInput').value;
    const subCat = document.getElementById('subcatInput').value;
    if (title) {
      shopData.push(new ShopItem(title, cat, subCat, false));
      saveToLocalStorage();
      renderView();
    }
  itemInput.value = '';
  }
   
  // --- Save and Load --- 
  function loadFromStorage() { //!add items if empty
  if (window.getPlanitSection) {
  const planitShopData = getPlanitSection("shopit");
    if (planitShopData.items) {
      try {
        //planitShopData.items.forEach(item => {
        //  item.tags = [];
        // item.order = false;  
        //});                   
        shopData = planitShopData.items;        
        //saveToLocalStorage();
        //console.log(shopData);  
      } catch (e) {
        console.warn("Could not parse saved tasks:", e);
        shopData = [];
      }
      }else{ 
        shopData = [
          new ShopItem('Butter', 'frequent', 'dairy', true),
          new ShopItem('Carrots', 'frequent', 'fruit-vegetables', true),
          new ShopItem('Onions', 'frequent', 'fruit-vegetables', true),
          new ShopItem('Soap', 'frequent', 'items', false)
        ];
        saveToLocalStorage();
      }
    }
  }

  function saveToLocalStorage() {
    if (window.updatePlanitSection) {
      updatePlanitSection("shopit", {
      items: shopData
      });
    }
  }
  
function getMismatchedItems(arr1, arr2) {
  const mismatches = [];
  arr1.forEach(item => {
    const original = item;
    //const itemWithouEs = item.replace(/\b(\w+?)(es|s)?\b/,'')
    item = item.replace(/s\b/, '');
    if (!arr2.includes(item)  && !arr2.includes(item + 's') ) { /* && !arr2.includes(itemWithouEs) */
      mismatches.push(original);
    }
  });
  return mismatches;
}
  // --- Menuit Integration ---    
  const stopList = ['and', 'with', 'on', 'fried', 'french','plain','rolls'];
  function loadMenuDataFromStorage() {    
    const dateList = [];
    const day = new Date(currentMonday);
    for(var i=0; i<7; i++){
      dateList.push(formatDate(day)); 
      day.setDate(day.getDate() + 1);          
    }    
    if (window.getPlanitSection) {
    const planitMenuData = getPlanitSection("menuit");
      if (planitMenuData.menuPlan) { 
        try {
          menuPlanData = []; //clear
          uniqueIngredients = []; 
          menuItemsData = planitMenuData.menuItems;  
          planitMenuData.menuPlan.forEach(item => {
            if(dateList.includes(item.date)){
              const titleText = item.title.toLowerCase()
              if(!menuPlanData.includes(titleText)){
                //find where title matches in plan and item data
                const menuItem = menuItemsData.find(m => m.title === item.title);
                if (menuItem) {
                 //get key ingredients and title words
                 const arr = titleText.split(" ").concat(menuItem.keyIngredients); 
                 arr.forEach(ingredient => {
                   if(!uniqueIngredients.includes(ingredient) && !stopList.includes(ingredient)){
                    uniqueIngredients.push(ingredient)   
                   } 
                 });                  
                }              
                menuPlanData.push(titleText)
               }           
              }          
          });
          menuPlanData.sort();
          uniqueIngredients.sort();         
          console.log(menuPlanData, uniqueIngredients); 
          const menuList = document.getElementById('menuList');
          menuList.innerHTML = uniqueIngredients.join(' '); 
          titleArray = shopData.map(item => item.title.toLowerCase());        
          //console.log(); 
          document.getElementById('noMatchList').innerHTML = getMismatchedItems(uniqueIngredients, titleArray);
          
              
        } catch (e) {
          menuPlanData = [];          
        }
      }else{ 
        menuPlanData = [];
      }
    }
  }
  
  // --- Render Functions ---
  function renderView(renderType) {
    //const constNotCaptured = [];
    //console.log(renderType);
    const list = document.getElementById('itemList');
    list.innerHTML = '';
    orderList.innerHTML = '';

    for (let item of shopData.sort(sortItems)) { 
      let altClass = '';
      if(renderType=='highlight' || renderType=='order'){
      const titleText = item.title.toLowerCase().replace(/s\b/, ''); 
        if(uniqueIngredients.includes(titleText) || uniqueIngredients.includes(titleText + 's')){
           if(renderType=='highlight') altClass = " suggested";
           if(renderType=='order') item.order = true;
        }
      }
     
      const sub = item.subCat;
      const div = document.createElement('div');
      div.className = 'item ' + (item.order? 'order-yes' : 'order-no') + " " + sub + "-" +  (item.order? 'yes' : 'no' );
      div.onclick = () => {
        updateSidePanel(item) 
      };
      
      const toggleContainer = document.createElement('div');
      toggleContainer.className = 'item-order-button ' + sub;
            
      const orderButton = document.createElement('button');
      orderButton.className = `order-button ${sub}`;
      orderButton.textContent = (item.order)? '✓':'✗';
      orderButton.onclick = () => {
        item.order = !item.order;
        saveToLocalStorage();
        renderView();
      };
            
      //toggleContainer.appendChild(toggle);
      div.appendChild(orderButton);

      const itemTitle = document.createElement('div');
      itemTitle.textContent = item.title;
      itemTitle.className = 'item-title';
      itemTitle.contentEditable = true;
      itemTitle.onblur = () => {
        item.title = itemTitle.textContent.trim();
        saveToLocalStorage();
        renderView();
      };
      div.appendChild(itemTitle);
      list.appendChild(div);
      
      
      if(item.order){
        const orderTitle = document.createElement('div');
        orderTitle.textContent = item.title;
        orderList.appendChild(orderTitle);
      }
    }
   // console.log(constNotCaptured)
  }
  
  function highlightItems(){
    renderView('highlight');
  }
  
  function orderItems(){
    renderView('order'); 
    saveToLocalStorage(); 
  }
  
  

  // --- Import and Export ---    
  function exportData() {
    exportCardData(shopData, 'shopit'); //planit.js     
  } 
  
  function importData(event) {
    const file = event.target.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        shopData = JSON.parse(e.target.result);
        saveAndRender();
      };
      reader.readAsText(file);
    }
  }
    
  // --- Initialization ---
  function initDomReferences() {
    dom.panelTitle = document.getElementById('title');
    dom.panelCat = document.getElementById('cat');
    dom.panelSubCat = document.getElementById('subCat');
    dom.panelOrder = document.getElementById('order');
    dom.panelTags = document.getElementById('tags');
   
    //Display matches on input
    itemInput.addEventListener('input', () => {
      const query = itemInput.value.trim().toLowerCase();
      matchDisplay.innerHTML = ''; // Clear previous matches
      if (query.length === 0) return;
      const matches = shopData.filter(item => item.title.toLowerCase().startsWith(query)); //.includes(query));
      if (matches.length > 0) {
        const matchList = matches
        .map(match => `<div style="padding:2px 4px;">${match.title}</div>`)
        .join('');
        matchDisplay.innerHTML = `
        <div style="border:1px solid #888; background:#1f1f1f; color:#fff; padding:5px; margin-top:4px; border-radius:4px;">
        <strong>Matches:</strong>
        ${matchList}
        </div>
        `;
      }
    });  
  }

  function initButtons() {
    document.getElementById("toggleButton")?.addEventListener("click", toggleSidePanel);
    document.getElementById("saveButton")?.addEventListener("click", saveShopItem);        
    document.getElementById("highlightButton")?.addEventListener("click", highlightItems);   
    document.getElementById("orderButton")?.addEventListener("click", orderItems);   
    document.getElementById('deleteButton')?.addEventListener("click", deleteShopItem);
    document.getElementById('addItemButton')?.addEventListener("click", addItem);
    
    
     
    //Import Export Json Data
    document.getElementById('exportDataButton')?.addEventListener('click', exportData);
    const importDataButton = document.getElementById('importDataButton');
    const hiddenFileInput = document.getElementById('hiddenFileInput');
    importDataButton?.addEventListener("click", () => hiddenFileInput?.click());
    hiddenFileInput?.addEventListener("change", importData); 
  }
    
  function init(){
    initDomReferences();  
    initButtons();
    loadFromStorage();
    loadMenuDataFromStorage();
    renderView();  
  }

  init();

  window.shopit = {
    init
  };

})();
