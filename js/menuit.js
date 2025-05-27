(function () {
  'use strict';

  // --- Global Declarations ---
  let currentMenuItemId = null;
  let currentMenuPlanId = null;
  let menuData = {menuPlan: [], menuItems: []};
  let shopData = [];
  let currentMonday = getMonday(new Date());  
  let currentDate = currentMonday;
  let currentFilter = '';

  const dom = {};
    
  // --- Helper Functions ---
  function saveAndRender() {
    saveToLocalStorage();
    renderView();  
  }

  function renderView(){
    renderPlanner();
    renderMenuList();  
  }
  
  function MenuPlanItem(title, date, meal, repeat, order, id){
    this.title = title;
    this.date = date;            
    this.meal = meal;
    this.repeat = repeat || false;
    this.order = order || 0;
    this.id = id || generateId();
  }
  
  function MenuItem(title, keyIngredients, tags, id){
    this.title = title;
    this.tags = tags;            
    this.keyIngredients = keyIngredients || [];
    this.id = id || generateId();
  }
  
  // Converts input string to array of trimmed tags
  function parseTags(inputString) {
    if (typeof inputString !== 'string') return [];
    return inputString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
  }

  // Converts tags array to comma-separated string
  function stringifyTags(tagsArray) {
    if (!Array.isArray(tagsArray)) return tagsArray || '';
    return tagsArray.join(', ');
  }
  
  function updateSidePanelItem(data) {
    currentMenuItemId = data.id;
    dom.itemTitle.value = data.title;
    dom.itemKeyIngredients.value = stringifyTags(data.keyIngredients);
    dom.itemTags.value = stringifyTags(data.tags);
  }
  
  function getItemPanelData() {
    return new MenuItem(
      dom.itemTitle.value.trim(),
      parseTags(dom.itemKeyIngredients.value),
      parseTags(dom.itemTags.value),
      currentMenuItemId
      );    
  }

  function saveMenuItem() {
    const panelData = getItemPanelData();
    //console.log(panelData, currentMenuItemId)
    if (currentMenuItemId) {
      const existing = menuData.menuItems.find(t => t.id === currentMenuItemId);
      Object.assign(existing, panelData);
    } else {
      menuData.menuItems.push(panelData);
    }
    saveAndRender();
  }

  //--- Planner Updates ---
  function updateSidePanelPlan(data) {
    currentMenuPlanId = data.id;
    dom.planTitle.value = data.title;
    dom.planRepeat.checked = data.repeat;
  }

  function saveMenuPlan() {
    if(currentMenuPlanId) {
      const existing = menuData.menuPlan.find(t => t.id === currentMenuPlanId);
      existing.title = dom.planTitle.value;
      existing.repeat = dom.planRepeat.checked;
    } 
    saveAndRender();
  }

 function deleteMenuPlan() {
  if(currentMenuPlanId) {
    menuData.menuPlan = menuData.menuPlan.filter(t => !(t.id === currentMenuPlanId));
    currentMenuPlanId = null;
    showToast(`planner item: deleted`, 'success');
    saveAndRender();
  }
 }  
 
 function addMenuItem() {
   currentMenuItemId = null;
   saveMenuItem();
 }  
 
 function deleteMenuItem() {
    menuData.menuItems = menuData.menuItems.filter(t => !(t.id === currentMenuItemId));
    updateSidePanelItem(new MenuItem('', [], [], null));
    currentMenuItemId = null;
    showToast(`item: deleted`, 'success');
    saveAndRender();
 }  
  
  function filterMenuList() {
    const term = dom.filterInput.value.trim();
    renderMenuList(term);
  }

  function filterByTag(tag) {
    renderMenuList(tag);
  }


    function prevWeek() {
      currentDate.setDate(currentDate.getDate() - 7);
      renderPlanner();
    }

    function nextWeek() {
      currentDate.setDate(currentDate.getDate() + 7);
      renderPlanner();
    }

/*
  
    function copyRepeating() {
      const weekStart = new Date(currentDate);
      const newPlans = menuData.menuPlan.filter(p => p.repeat === true).map(p => {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + days.indexOf(p.day));
        return new MenuPlanItem(p.title, formatDate(date), p.meal, p.repeat, p.order); //new id
      });
      menuData.menuPlan.push(...newPlans);
      console.log(newPlans)
      saveAndRender();
    }
 
 */
   
  function copyRepeats() {
    const newWeek = [];
    const lastWeekStart = new Date(currentMonday);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    for (let i = 0; i < 7; i++) {
      const date = new Date(lastWeekStart);
      date.setDate(date.getDate() + i);
      const dateStr = formatDate(date);
      const nextDate = new Date(currentMonday);
      nextDate.setDate(nextDate.getDate() + i);
      const nextDateStr = formatDate(nextDate);
      menuData.menuPlan.filter(t => t.date === dateStr && t.repeat).forEach(t => {    
        //newWeek.push(new Task(t.title,nextDateStr,"not-started",t.repeat));
        newWeek.push(new MenuPlanItem(t.title, nextDateStr, t.meal, t.repeat, t.order));
      });
    }
    console.log(newWeek)
    menuData.menuPlan = menuData.menuPlan.concat(newWeek);
  saveAndRender();      
  }

  function sortItems(a, b) {
    return a.title.localeCompare(b.title);
  } 
  
  function updateMenuPlanOrder(container) {
    const items = container.querySelectorAll('.menu-plan-item'); 
    items.forEach((el, index) => {
    const id = el.dataset.id; 
    const item = menuData.menuPlan.find(m => m.id === id);
    if (item) {
      item.order = index; 
    }
    });   
  }

 function sortMenuPlan(array) {
    const mealOrder = { breakfast: 1, lunch: 2, dinner: 3, dessert: 4 };
    array.sort((a, b) => {
    if (a.date !== b.date) {
      return a.date.localeCompare(b.date); // sort by date
    } else if ((mealOrder[a.meal] || 99) !== (mealOrder[b.meal] || 99)) {
      return (mealOrder[a.meal] || 99) - (mealOrder[b.meal] || 99); // then by meal
    } else {
      return (a.order || 0) - (b.order || 0); // finally by order
    }
    });
  }
      
  function createMealHeader(headerText, className){
    const headerDiv = document.createElement('div');
    headerDiv.textContent = headerText;
    headerDiv.className = className;
    return headerDiv;
  }

  function createDropTarget(date, meal, label){
    
   const flexContainer = document.createElement('div');
   flexContainer.className = 'flex-container';
   
   const fixedPart = document.createElement('div');
   fixedPart.className = `meal-${meal} fixed-part`;
   fixedPart.textContent = label; 
   
   //drop target
   const flexPart = document.createElement('div');
   flexPart.className = 'sortable flex-part';  
   flexPart.id = `${date}_${meal}`;
   
   
   flexContainer.appendChild(fixedPart);
   flexContainer.appendChild(flexPart);
   
   return flexContainer;
  }     

  // --- Render Functions ---
  function renderPlanner() {
    sortMenuPlan(menuData.menuPlan);
    const planner = document.getElementById('planner');
    planner.innerHTML = '';
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + i);
      const dayTitle = date.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
      const dateStr = formatDate(date);
      //const dayName = days[i];
      const section = document.createElement('div');
      section.className = 'planner-day';
      section.appendChild(createMealHeader(`${dayTitle}`,'date-title'));       
      section.appendChild(createDropTarget(dateStr,'breakfast', 'bre'));
      section.appendChild(createDropTarget(dateStr,'lunch', 'lun'));
      section.appendChild(createDropTarget(dateStr,'dinner', 'din'));
      section.appendChild(createDropTarget(dateStr,'dessert', 'des'));
      planner.appendChild(section);
    }
    for (const p of menuData.menuPlan) {
      const item = document.createElement('div');
      item.className = `menu-plan-item isrepeat-${p.repeat}`;
      item.textContent = p.title;
      item.dataset.id = p.id;
      item.onclick = () => updateSidePanelPlan(p);
      const target = document.getElementById(`${p.date}_${p.meal}`);
      if (target) target.appendChild(item);
    }
    document.querySelectorAll('.sortable').forEach(el => {
      Sortable.create(el, {
        group: 'planner',
        //animation: 150,
        onAdd: function (evt) {
          const title = evt.item.textContent;
          if(evt.item.dataset.id){
            //delete as being moved from one target to another
            const id = evt.item.dataset.id;
            menuData.menuPlan = menuData.menuPlan.filter(p => p.id !== id);  
          }  
          const parentId = evt.to.id;
          const [date, meal] = parentId.split('_');
          const id = generateId();
          evt.item.dataset.id = id;
          menuData.menuPlan.push(new MenuPlanItem(title, date, meal, false, 0, id));
          updateMenuPlanOrder(evt.to);
          renderMenuList(currentFilter);
          sortMenuPlan(menuData.menuPlan);
          renderPlanner();
          saveToLocalStorage();          
        },
       onUpdate: function (evt) {
        updateMenuPlanOrder(evt.to);
        sortMenuPlan(menuData.menuPlan);
        saveToLocalStorage();
       }               
      });
    });
  }

  function renderMenuList(filter = '') {
    menuData.menuItems.sort(sortItems);  
    currentFilter = filter;
    dom.filterInput.value = filter;  
      const list = document.getElementById('menuList');
      list.innerHTML = '';
      menuData.menuItems.forEach(item => {
        //if (filter && !item.tags.includes(filter) && !item.title.toLowerCase().includes(filter.toLowerCase())) return;
        if (filter && !item.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase())) &&
        !item.title.toLowerCase().includes(filter.toLowerCase())
        ) return;
        const div = document.createElement('div');
        div.className = 'menu-item';
        div.textContent = item.title;
        div.onclick = () => updateSidePanelItem(item);
        list.appendChild(div);
      });
      Sortable.create(list, {
        group: 'planner',
        animation: 150,
        sort: false
      });
    }

  // --- Save and Load ---
  function loadFromLocalStorage() {    
    if (window.getPlanitSection) {
    const menuitData = getPlanitSection("menuit");
    if (menuitData.menuPlan && menuitData.menuItems) {
      try {
        menuData.menuPlan = menuitData.menuPlan;  
        menuData.menuItems = menuitData.menuItems;
         /*       
        
        const importFromList = ['Moussaka','Sushi Tuna Avocado','Sushi Teriyaki Chicken','Sushi California Roll','Okonomiyaki Pancake','Japanese Curry Pastries','Samosas','Spring onion pancake','Steamed Buns','Pork Dumplings ','Lamb Dumplings','Tomato Chutney','Fresh pasta','Hummus','Cold Ramen Noodles','Bagels','Pizza','Home made Ramen noodles','Sausage Bake','Fish Wraps','Spicy chicken wings','Tuna Inari Zushi','Jollof Rice','Grilled chicken','Chicken and Chips','Nasi Goreng Rice','Thai Rice Noodles','Lamb Kofta Wraps','Rice and Fish','Pesto Pizza','Prawn rolls and salad','Green tea noodles and prawn','Tempura Grated','Tempura Mushrooms','Vegetable Pakoras','Japanese Egg Custard','Fried Kway Teow','Satay Chicken Noodles','Macaroni ','Nachos and beans','Spicy Chicken Wraps','Pumpkin and Peanut Soup','Savory muffins','Cornbread ','Mushroom Arancini','Fish Tacos and beans','Chicken strips and chips','Croissant','Chicken Laksa','Tom Yum','Mee Goreng'];
        console.log(importFromList)
        importFromList.forEach(item => {
          console.log(item)
          menuData.menuItems.push(new	MenuItem(item, ['lunch','dinner'], []));
        });
        saveToLocalStorage();
        renderMenuList();
        
                

        menuData.menuItems.forEach(item => {
        item.keyIngredients = [];
        });     
        saveToLocalStorage();        
        console.log(menuData.menuItems)

        menuData.menuPlan.forEach(item => {
          item.repeat = false;
        });     
        saveToLocalStorage();        
        console.log(menuData.menuPlan)
        */  
                 
      } catch (e) {
        console.warn("Could not parse saved menuit data:", e);
        menuData = {menuPlan: [], menuItems: []};
      }
    } else {
      const day = new Date(currentMonday);
      const monday = formatDate(day);
      menuData.menuPlan = [
      new  MenuPlanItem('Avocado on Toast', monday, 'breakfast', 0),
      new  MenuPlanItem('Fried Rice', monday, 'lunch', 0),
      ]
      menuData.menuItems = [
      new  MenuItem('Avocado on Toast', ['breakfast'], ['avocado','bread']),
      new  MenuItem('Fried Rice', ['lunch','dinner'], ['rice','soy sauce']),
      ];
      saveToLocalStorage();
    }
    }
  }
    
  function saveToLocalStorage() {
    console.log("saving")
    if(window.updatePlanitSection) {
      updatePlanitSection("menuit", {menuPlan:menuData.menuPlan, menuItems:menuData.menuItems});
    }      
  }

  // --- Import and Export ---
  function exportData() {
    exportCardData(menuData, 'menuit'); //planit.js     
  } 
  
  function importData(event) {
    const file = event.target.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        menuData = JSON.parse(e.target.result);
        saveAndRender();
      };
      reader.readAsText(file);
    }
  }

  // --- Shopit Integration ---  
  function loadShopDataFromStorage() { 
  if (window.getPlanitSection) {
  const planitShopData = getPlanitSection("shopit");
    if (planitShopData.items) {
      try {
        shopData = []; //clear            
        planitShopData.items.forEach(item => {
          shopData.push(item.title.toLowerCase()); //only get title 
        });         
        //console.log(shopData);       
      } catch (e) {
        shopData = [];
      }
      }else{ 
        shopData = [];
      }
    }
  }


    
  // --- Initialization ---
  function initDomReferences() {
    dom.itemTitle = document.getElementById("itemTitle");
    dom.itemTags = document.getElementById("itemTags");
    dom.itemKeyIngredients = document.getElementById("itemKeyIngredients");
    dom.planTitle = document.getElementById("planTitle");
    dom.planRepeat = document.getElementById("planRepeat");    
    dom.filterInput = document.getElementById('filterInput'); 
    dom.filterInput.addEventListener("input", filterMenuList);
    
    Sortable.create(document.getElementById('del'), {
      group: 'planner',
      onAdd: function (evt) {
        const id = evt.item.dataset.id;
        menuData.menuPlan = menuData.menuPlan.filter(p => p.id !== id);
        evt.item.remove();
        renderPlanner();
        saveToLocalStorage();
      }
    }); 
  }
    
  function initButtons(){    
    document.getElementById("filterByBreakfastBtn")?.addEventListener("click",function(){filterByTag('breakfast');});
    document.getElementById("filterByLunchBtn")?.addEventListener("click",function(){filterByTag('lunch');});
    document.getElementById("filterByDinnerBtn")?.addEventListener("click",function(){filterByTag('dinner');});
    document.getElementById("filterByDessertBtn")?.addEventListener("click",function(){filterByTag('dessert');});
    document.getElementById("filterBySidesBtn")?.addEventListener("click",function(){filterByTag('sides');});
    document.getElementById("showAllButton")?.addEventListener("click",function(){filterByTag('');});
    document.getElementById("toggleButton")?.addEventListener("click", toggleSidePanel);   
    document.getElementById("prevWeekBtn")?.addEventListener("click", prevWeek);
    document.getElementById("nextWeekBtn")?.addEventListener("click", nextWeek);
    document.getElementById("copyRepeatsBtn")?.addEventListener("click", copyRepeats);      
    document.getElementById("saveMenuItemButton")?.addEventListener("click", saveMenuItem);
    document.getElementById("newMenuItemButton")?.addEventListener("click", addMenuItem);
    document.getElementById("deleteMenuItemButton")?.addEventListener("click", deleteMenuItem);    
    document.getElementById("savePlanButton")?.addEventListener("click", saveMenuPlan);
    document.getElementById("deletePlanButton")?.addEventListener("click", deleteMenuPlan); 
        
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
    loadShopDataFromStorage();
    initButtons();
    renderView();     
  }   
    
  init();

  window.menuit = {
    init
  };

})();
