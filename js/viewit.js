(function () {
  'use strict';

  // --- Global Declarations ---
  let viewData = [];
  let settingsData = {
    theme: "dark",
    customTheme: {
      '--color-bg': {color:'#C45448', label:'background'}, 
      '--color-panel': {color:'#C45448', label:'panel'},
      '--color-text': {color:'#C45448', label:'text'},
      '--color-header': {color:'#C45448', label:'header'},
      '--color-button': {color:'#C45448', label:'button'},
      '--color-nav-button': {color:'#C45448', label:'nav buttons'}
      //could add darker colour using pSBC --color-nav-button-hover but not add to settings  
      }    
  };
  const dom = {};

  // --- Helper Functions ---
  function getTodaysData(){
      
  }
  

  function changeTheme(update){
    if(update){ 
      settingsData.theme = themeSelector.value;
      saveToLocalStorage();
    }
    //load theme
    const root = document.documentElement;   
    root.setAttribute('data-theme', settingsData.theme);      
  }
       
  function changeThemeElement(rule, color){
    //console.log(rule, color)
    const variables = {};
    variables[rule] = `${color}`;
    updateTheme("custom", variables);
    settingsData.customTheme[rule].color = color; 
    saveToLocalStorage();  
  }
  
  function createThemeColorPickers(){
    dom.customColourPickers.innerHTML = '';
    
    Object.keys(settingsData.customTheme).forEach(key => {
      console.log(key, settingsData.customTheme[key].color, settingsData.customTheme[key].label)  
 
      const container = document.createElement('div');
      container.className = 'colour-picker-container';
      
      const colorPicker = document.createElement("input");
      colorPicker.setAttribute("type", "color");
      colorPicker.className = 'color-picker';
      colorPicker.oninput = () => changeThemeElement(key, colorPicker.value);
      colorPicker.value = settingsData.customTheme[key].color;

      const label = document.createElement('div');
      label.className = 'colour-picker-label';
      label.textContent = settingsData.customTheme[key].label;
      
      container.appendChild(colorPicker);
      container.appendChild(label);
      dom.customColourPickers.appendChild(container);
      
    });    
  }
  
  function updateCustomTheme(){
    
    const variables = {};
    
    Object.keys(settingsData.customTheme).forEach(key => {
    variables[key] = settingsData.customTheme[key].color;    
    })
    
    updateTheme("custom", variables);     
  }
  
  /*
  // Version 4.0
  const pSBC=(p,c0,c1,l)=>{
    let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
    if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
    if(!this.pSBCr)this.pSBCr=(d)=>{
      let n=d.length,x={};
      if(n>9){
        [r,g,b,a]=d=d.split(","),n=d.length;
        if(n<3||n>4)return null;
        x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
      }else{
        if(n==8||n==6||n<4)return null;
        if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
        d=i(d.slice(1),16);
        if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
        else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
      }return x};
    h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=this.pSBCr(c0),P=p<0,t=c1&&c1!="c"?this.pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
    if(!f||!t)return null;
    if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
    else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
    a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
    if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
    else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
  }  
  */
  // --- Render Functions ---
  function createViewitBox(titleStr, data, icon){
    const block = document.createElement('div');
    block.className = 'view-block';

    const title = document.createElement('div');
    title.className = 'view-title';
    title.onclick = () => loadView(icon)
    
    const svg = createSvg(icon + 'Icon', 'nav-icon');  
    
    const titleText = document.createElement('div');
    titleText.className = 'view-title-text';
    titleText.textContent = titleStr;
      
    title.appendChild(titleText);
    title.appendChild(svg);
    
    const content = document.createElement('div');
    content.className = 'view-content'; 
    
    data.forEach(itemData => {
      const item = document.createElement('div');
      item.className = 'view-item';
          
      const itemTitle = document.createElement('div');
      itemTitle.className = 'view-item-title';
      itemTitle.textContent = itemData.title;      
      
      if(itemData.icon){
        const itemIcon = createSvg(itemData.icon, 'view-item-svg');
        item.appendChild(itemIcon);
      }
      
      item.appendChild(itemTitle);
      content.appendChild(item);
    });
        
    block.appendChild(title);  
    block.appendChild(content);
    viewSection.appendChild(block);
  }

  function createView(title, cardName,filterName, filterProperty, filterValue){
    //cardName
    const itemList = [];
    const data = getPlanitSection(cardName);
    if(data[filterName]){
      const dataFiltered = data[filterName].filter(t => t[filterProperty] === filterValue) || []; 
      dataFiltered.forEach(item => {
        itemList.push({icon:null, title:item.title})
      });       
    }else{
        itemList.push({icon:null, title:'No data'});      
     }
    createViewitBox(title, itemList, cardName);    
  }
  
  function limitedRandomSelection(arr, len){
    arr = JSON.parse(JSON.stringify(arr)); //clone 
    //remove random
    const newLength = (arr.length<len)? arr.length:len;
    do{
      arr.splice(Math.floor(Math.random()*arr.length), 1); 
    }     
    while(arr.length>newLength); 
    return arr;   
  }
    
  function renderView(){
    //init
    viewSection.innerHTML = '';
    const today = new Date();
    const todayStr = formatDate(today)
    
    //tasks
    const taskitData = getPlanitSection('taskit');
    if(taskitData.tasks){
      const taskitDataFiltered = taskitData.tasks.filter(t => t.date === todayStr && t.status !== 'ignore' && t.status !== 'complete') || [];
      const taskitItems = [];
      taskitDataFiltered.forEach(task => {
        taskitItems.push({icon:task.status, title:task.title})
      });
      createViewitBox('Tasks', taskitItems, 'taskit')
    }
    
    createView('Shop', 'shopit', 'items', 'order', true);    
    createView('Menu', 'menuit', 'menuPlan', 'date', todayStr);
    
    //recipeit
    const recipeData = getPlanitSection('recipeit');
    if(recipeData?.recipes){      
      const recipes = limitedRandomSelection(recipeData.recipes, 7);
      createViewitBox('Recipes', recipes, 'recipeit');
    }  
    
    createView('Watch', 'watchit', 'shows', 'watching', true);
    createView('Read', 'readit', 'books', 'reading', true);
    createView('Listen', 'listenit', 'audio', 'listening', true);
    createView('Play', 'gameit', 'games', 'playing', true);
    
    
    //buildit
    const buildData = getPlanitSection('buildit');
    if(buildData?.projects){           
      const projects = limitedRandomSelection(buildData.projects, 4);
      createViewitBox('Build', projects, 'buildit');
    }  
    
    //growit
    const growData = getPlanitSection('growit'); 
    let growItems = [];
    const currentMonth = new Date().getMonth() + 1;
    growData.plants.forEach(growItem => {
      if (growItem.month.includes(currentMonth)) {
        growItems.push({icon:null, title:growItem.title});   
      }     
    });   
    growItems = limitedRandomSelection(growItems, 7)
    createViewitBox('Grow', growItems, 'growit');
    

  } 
  
  // --- Save and Load ---
  function loadFromLocalStorage() {
    if (window.getPlanitSection) {
      const saved = getPlanitSection("settings"); //planit.js
      if (saved?.theme) {
        try {
          settingsData.theme = saved.theme;
          dom.themeSelector.value = settingsData.theme;
          
          if(saved.customTheme) { //else revert to above settings            
            settingsData.customTheme = saved.customTheme; 
          } 
          console.log(settingsData.customTheme);
          changeTheme(false);          
        } catch (e) {
          console.warn("Could not parse saved settings data:", e);
          settingsData = {};
        }
      } else {
        //do nothing
      }
    }
  }

  function saveToLocalStorage() {
    if (window.updatePlanitSection) {
      //console.log(settingsData)
      updatePlanitSection("settings", settingsData); //planit.js
    }
  }

  // --- Import and Export ---    
  function exportData() {
    exportPlanitData(); //planit.js     
  } 
  
  function importData(event) {
    importPlanitData(event); //planit.js 
  }

  // --- Initialization ---
  function initDomReferences() {
    //dom.sidePanel = document.getElementById('sidePanel');
    const viewSection = document.getElementById('viewSection');  
    const output = document.getElementById('output');
  } 
  


  function initButtons() {
    document.getElementById("toggleButton")?.addEventListener("click", toggleSidePanel);
    document.getElementById("reloadButton")?.addEventListener("click", init);
    document.getElementById("showTailwindButton")?.addEventListener("click", showTailwindColors);
    document.getElementById("openModalButton")?.addEventListener("click", openModal);
    document.getElementById('myToggle').addEventListener('change', toggleTheme); 
    document.getElementById('toggleFullscreenButton').addEventListener('click', toggleFullscreen); 
    
    dom.themeSelector =  document.getElementById('themeSelector')
    dom.customColourPickers =  document.getElementById('customColourPickers')
    dom.themeSelector.addEventListener('change', function () {changeTheme(true); });
    
    /*
    document.getElementById('bgColorPicker').addEventListener('input', (e) => {
      const newColor = e.target.value;
      const theme = 'custom'//document.documentElement.dataset.theme; // e.g., "sand-dune"
      const vars = {'--color-bg': newColor};

      //applyThemeVariables(theme, vars);
      //saveCustomTheme(theme, vars);
      
      updateTheme(theme, vars)
    });
      */ 
    
    /*
    document.getElementById('myToggle').addEventListener('change', function () {
    console.log('Toggle is now:', this.checked ? 'ON' : 'OFF');
    });
    */
     
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
    renderView();
    loadFromLocalStorage();
    createThemeColorPickers();
    updateCustomTheme();
  }

 init();

  window.viewit = {
    init
  };

})();
