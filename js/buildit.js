(function () {
  'use strict';

  // --- Global Declarations ---
  let buildData = {};
  const dom = {};
  const statuses = ["pending", "complete", "started", "ignore"];

  // --- Helper Functions ---
  function saveAndRender() {
    saveToLocalStorage();
    renderView();
  }
  
  function BuildItem(title, service, type, building, series, tags, id) {
    this.title = title;
    this.service = service;
    this.type = type;
    this.building = building;
    this.series = series;
    this.tags = tags;
    this.id = id || generateId(); //planit.js
  }

  function ProjectItem(title, status, type, sortOrder, id) {
    this.title = title;
    this.status = status || 'pending';
    this.type = type || '';
    this.order = sortOrder || 0;
    this.activities = [];
    this.tags = [];
    this.id = id || generateId(); //planit.js
  }
  
  function ActivityItem(title, status, type, sortOrder, startDate, endDate, id) {
    this.title = title;
    this.status = status || 'pending';
    this.type = type || '';
    this.order = sortOrder || 0;
    this.tasks = [];
    this.startDate = startDate || '',
    this.endDate = endDate || '',
    this.tags = [];
    this.id = id || generateId(); //planit.js
  }  

  function TaskItem(title, status, type, sortOrder, startDate, endDate, id) {
    this.title = title;
    this.status = status || 'pending';
    this.type = type || '';
    this.order = sortOrder || 0;
    this.startDate = startDate || '',
    this.endDate = endDate || '',
    this.tags = [];
    this.id = id || generateId(); //planit.js
  }    

  function updateSidePanel(data) {
    //currentBuildItemId = data.id;
    console.log(data)
    dom.panelTitle.value = data.title;
    // dom.panelService.value = data.service;
    // dom.panelType.value = data.type;
    // dom.panelBuilding.checked = data.building;
    // dom.panelSeries.checked = data.series;
    // dom.panelTags.value = Array.isArray(data.tags) ? data.tags.join(', ') : data.tags || '';
  }

  function clearSidePanel() {
    updateSidePanel(new BuildItem('', '', '', false, false, [], null));
  }

  function getPanelData() {
    return {
      title: dom.panelTitle.value,
      service: dom.panelService.value,
      type: dom.panelType.value,
      building: dom.panelBuilding.checked,
      series: dom.panelSeries.checked,
      tags: dom.panelTags.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    };
  }

  function saveBuildItem() {
    const panelData = getPanelData();

    if (currentBuildItemId) {
      const existing = buildData.find(t => t.id === currentBuildItemId);
      Object.assign(existing, panelData);
    } else {
      buildData.push(new BuildItem(
        panelData.title,
        panelData.service,
        panelData.type,
        panelData.building,
        panelData.series,
        panelData.tags,
        null
      ));
    }

    saveAndRender();
    showToast(`${panelData.title} updated`, 'success');
  }

  function addNewProject() {
    const newTitle = dom.titleInput.value.trim();
    if (!newTitle) {
      showToast("Please enter a title first.", 'error');
      return;
    }       
    const newProject = new ProjectItem(newTitle);
    buildData.projects.push(newProject);
    buildData.currentProjectId = newProject.id;   
    // const newItem = new BuildItem(newTitle, '', '', false, false, [], null);
    // buildData.push(newItem);
    // updateSidePanel(newItem);
    saveAndRender();
    showToast(`${newTitle} added`, 'success');
  }
  
  
  function addNewActivity(project){
     //const project  = buildData.projects.find(t => t.id === buildData.currentProjectId);
     //console.log(project, pj);
     project.activities.push(new ActivityItem('New Activity'));
     saveAndRender();
  }
  
  
  function addNewTask(activity){
    //const project  = buildData.projects.find(t => t.id === buildData.currentProjectId);
    //const activity = project.activities.find(t => t.id === activityId);
    //console.log(project, activity);
    activity.tasks.push(new TaskItem('New Task'));
    saveAndRender();
  }
  
  function updateTaskTitle(task, title){
    const taskTitle =  title.innerText.trim();
    task.title = taskTitle
    saveAndRender();
  } 
  
  function toggleStatus(task) {
    const currentIndex = statuses.indexOf(task.status);
    const nextIndex = (currentIndex + 1) % statuses.length;
    task.status = statuses[nextIndex];
    if(task.status=="complete"){
      showToast(`good job!`, 'success');     
    }
    //updateSidePanel(task);
    saveAndRender();
  }
  
  function deleteTask(task, activity) {
    showToast(`task: ${task.title} deleted`, 'success'); 
    
    //console.log(activity.tasks.filter(t => !(t.id === task.id)));
    
      
    activity.tasks = activity.tasks.filter(t => !(t.id === task.id));
    saveAndRender();
  } 

  // --- Render Functions ---
  function renderView() {
    dom.buildView.innerHTML = '';
    dom.projectSelect.innerHTML = '';

    if (buildData.length === 0) {
      dom.buildView.innerHTML = '<div class="no-items">Nothing to build!</div>';
      return;
    }
   /*   
      buildData.sort((a, b) => {
        if (a.building !== b.building) {
          return a.building ? -1 : 1; // true comes before false
        }
        return a.title.localeCompare(b.title); // A-Z by title
      });
   */
    
    buildData.projects.forEach(project => {
      //update select
      const option = document.createElement('option');
      option.text = project.title;
      option.value = project.id;
      option.selected = (project.id===buildData.currentProjectId)? 'selected':''; 
      dom.projectSelect.appendChild(option);
      
      if(project.id===buildData.currentProjectId){      
        
        //update main view
        const div = document.createElement('div');
        div.className = `pro-item project-title`; // buildit-item ${item.type.toLowerCase()} building-${item.building}`;
        div.dataset.id = project.id;
        div.onclick = () => updateSidePanel(project);
        
        const projectTitle = document.createElement('div');
        projectTitle.textContent = `${project.title}`;
        projectTitle.className = 'activity-title-text';
        
        const projectButton = document.createElement('button');
        projectButton.innerHTML = '+ add new activity';
        projectButton.className = 'activity-title-button';
        projectButton.onclick = () => addNewActivity(project);
        
        div.appendChild(projectTitle);
        div.appendChild(projectButton);
        dom.buildView.appendChild(div);
        
        project.activities.forEach(activity => {          
          const activityTitle = document.createElement('div');
          activityTitle.className = 'pro-item activity-title';
          //activityTitle.onclick = () => updateSidePanel(activity);
          const titleDiv = document.createElement('div');
          titleDiv.textContent = `${activity.title}`;
          titleDiv.className = 'activity-title-text';
          titleDiv.contentEditable='true';
          titleDiv.onblur = () => updateTaskTitle(activity, titleDiv);
          
          const addButton = document.createElement('button');
          addButton.innerHTML = '+ add new task';
          addButton.className = 'activity-title-button';
          addButton.onclick = () => addNewTask(activity);          
          
          activityTitle.appendChild(titleDiv);
          activityTitle.appendChild(addButton);          
          dom.buildView.appendChild(activityTitle);
          
          activity.tasks.forEach(task => {
            const taskContainer = document.createElement('div');
            taskContainer.className = `pro-item task-title ${task.status}`;
           
            const taskTitle = document.createElement('div');
            taskTitle.className = 'activity-title-text';
            taskTitle.textContent = `${task.title}`;
            taskTitle.contentEditable='true';
            taskTitle.onblur = () => updateTaskTitle(task, taskTitle);
            
            const statusSvg = createSvg(task.status, 'icon');
            statusSvg.onclick = () => toggleStatus(task);
            
            const deleteSvg = createSvg('delete', 'icon');
            deleteSvg.onclick = () => deleteTask(task, activity);
            
            taskContainer.appendChild(taskTitle);
            taskContainer.appendChild(statusSvg);
            taskContainer.appendChild(deleteSvg);
            
            dom.buildView.appendChild(taskContainer);
          });
        }); 
      }     
    });
  }
  
  
// --- Gantt view ---  
  
  let days = 20;
  let startDate = new Date('2025-05-05');
  const todaysDate = formatDate(new Date());
  
  const tasks = [
    { name: "Foundation", startDate: '2025-05-01', endDate: '2025-05-05' },
    { name: "Framing", startDate: '2025-05-06', endDate: '2025-05-12' },
    { name: "Roofing", startDate: '2025-05-13', endDate: '2025-05-17' },
    { name: "Wiring", startDate: '2025-05-18', endDate: '2025-05-22' },
    { name: "Finishing", startDate: '2025-05-23', endDate: '2025-05-30' },
    { name: "Long", startDate: '2025-05-01', endDate: '2025-06-01' },
  ];
  
  function changeDayRangeAndDate(dayRange, dateStr){
    days = dayRange;
    startDate = new Date(dateStr);
    renderGanttView();
  }
  
  function forward(){
    const day = new Date(startDate);
    day.setDate(day.getDate() + 1);
    startDate = formatDate(day);    
    changeDayRangeAndDate(days, startDate);
   }
   
  function back(){
    const day = new Date(startDate);
    day.setDate(day.getDate() - 1);
    startDate = formatDate(day);    
    changeDayRangeAndDate(days, startDate);
  }
  function zoomOut(){
    days++;
    changeDayRangeAndDate(days, startDate);
  } 
 
  function zoomIn(){
    days--;
    changeDayRangeAndDate(days, startDate);
  } 
  
  function showAll(){
    //days -= num;
    //changeDayRangeAndDate(days, startDate);
  } 

  
  function renderGanttView(){
    const gantt = document.getElementById("gantt");    
    gantt.innerHTML = '';
    
    const ganttLineDiv = document.createElement("div");
    ganttLineDiv.className = 'gantt-row gantt-row-lines';
    ganttLineDiv.id = 'ganttLines';
    ganttLineDiv.style.gridTemplateColumns = `150px repeat(${days}, 1fr)`;
    gantt.appendChild(ganttLineDiv);
   
    
    const label = document.createElement("div");
    label.className = 'label';
    label.style.opacity = '0';
    gantt.appendChild(label);
    
    dom.ganttLines = document.getElementById('ganttLines');

    //console.log(dom.ganttLines);
   
    gantt.style.gridTemplateColumns = `150px repeat(${days}, 1fr)`;
    //ganttLines.style.gridTemplateColumns = `150px repeat(${days}, 1fr)`;

    function dateDiffInDays(a, b) {
      const MS_PER_DAY = 1000 * 60 * 60 * 24;
      return Math.round((b - a) / MS_PER_DAY);
    }
    function isOdd(num) { 
      return num % 2;
    }
    function createBlank(offset, index){    
      const blank = document.createElement("div");
      blank.style.gridColumn = `span ${offset}`; 
      if(isOdd(index)){
        blank.className = 'shade';
        blank.innerHTML = '&nbsp;';
      } 
      return blank
    }


    // Add date headers
    for (let d=0; d<days; d++) {
      const day = new Date(startDate);
      day.setDate(day.getDate() + d);
      const dayIso = formatDate(day);
      
      const label = document.createElement("div");
      label.className = "day-label";
      label.textContent = day.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
      gantt.appendChild(label);
      
      //required to pad out start
      if(d==0){
        dom.ganttLines.appendChild(document.createElement("div"));  
      }
            
      const ganttLineDiv = document.createElement("div");      
      if(dayIso==todaysDate){ //get for today's date
          ganttLineDiv.className = 'marker';
      }      
      dom.ganttLines.appendChild(ganttLineDiv);
    }
          
    // Add each task row
    tasks.forEach((task, index) => {
      const rowClassName = (isOdd(index))? ' shade':'';
      const start = new Date(task.startDate);
      const end = new Date(task.endDate);
      let startOffset = dateDiffInDays(startDate, start);
      let endOffset = dateDiffInDays(startDate, end);
      let duration = dateDiffInDays(start, end) + 1;
      let additionalStyle = '';
      const total = startOffset + duration;
      //console.log(task, startOffset, duration, total, days,startOffset<0, total>days, endOffset, index);

      if(startOffset<0 && total>days){    
        startOffset = 0;
        duration = days;
        additionalStyle = ' bar-before-off-chart';
      }else if(total>days){
        duration = days-startOffset;
        additionalStyle = ' bar-off-chart'  
      }else if(startOffset<0){
        duration += startOffset;
        startOffset = 0;
        additionalStyle = ' bar-before-chart'  
      }   
        
        // Add label
        const label = document.createElement("div");
        label.className = 'label' + rowClassName;
        label.textContent = task.name;
        gantt.appendChild(label);

         if(startOffset!=0){
           gantt.appendChild(createBlank(startOffset, index));
        }
        
        //if the start offset is less than display days then it starts before last display day
        //if endOffset (difference between) is greater or equal to 0
        if(startOffset<days && endOffset>=0){
          const barContainer = document.createElement("div");
          barContainer.style.gridColumn = `span ${duration}`;
          barContainer.className = rowClassName;
                    
          const bar = document.createElement("div");
          bar.className = 'bar' + additionalStyle;
          bar.dataset.start = task.startDate;
          bar.dataset.end = task.endDate;
          bar.textContent = task.name; // `${duration} days`;
          barContainer.appendChild(bar)
          gantt.appendChild(barContainer);         
        }

        const remaining = days - startOffset - duration;        
        if(remaining!=0){     
         gantt.appendChild(createBlank(remaining, index));
        }      
    });
  }
    
  // --- Save and Load ---
  function loadFromLocalStorage() {
    if (window.getPlanitSection) {
      const saved = getPlanitSection("buildit"); //planit.js
      if (saved?.projects) {
        try {
          buildData.currentProjectId = saved.currentProjectId;  
          buildData.projects = saved.projects;  
        } catch (e) {
          console.warn("Could not parse saved buildit data:", e);
          buildData = [];
        }
      } else {
        const starterProject = new ProjectItem('Bird House', 'pending', 'hobby project');
        starterProject.activities.push(new ActivityItem('buy materials')); 
        starterProject.activities.push(new ActivityItem('carpentry'));        
        starterProject.activities[0].tasks.push(new TaskItem('buy nails'));
        starterProject.activities[0].tasks.push(new TaskItem('buy wood'));        
        starterProject.activities[1].tasks.push(new TaskItem('cut roof'));
        starterProject.activities[1].tasks.push(new TaskItem('drill bird house entrance'));        
        buildData = {currentProjectId:starterProject.id, projects:[starterProject]};
        saveToLocalStorage();
      }
    }
  }

  function saveToLocalStorage() {
    if (window.updatePlanitSection) {
      updatePlanitSection("buildit", buildData); //planit.js
    }
  }

  // --- Import and Export ---    
  function exportData() {
    exportCardData(buildData, 'buildit'); //planit.js     
  } 
  
  function importData(event) {
    const file = event.target.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        buildData = JSON.parse(e.target.result);
        saveAndRender();
      };
      reader.readAsText(file);
    }
  }
  
  function changeProject(){
    buildData.currentProjectId = dom.projectSelect.value;
    saveAndRender(); 
  }
    
  // --- Initialization ---
  function initDomReferences() {
    dom.projectSelect = document.getElementById('projectSelect');
    dom.buildView = document.getElementById('buildView');
    dom.sidePanel = document.getElementById('sidePanel');
    dom.panelTitle = document.getElementById('title');
    dom.panelService = document.getElementById('service');
    dom.panelType = document.getElementById('type');
    dom.panelBuilding = document.getElementById('building');
    dom.panelSeries = document.getElementById('series');
    dom.panelTags = document.getElementById('tags');
    dom.titleInput = document.getElementById('titleInput');
   
    dom.projectSelect?.addEventListener('change', changeProject);
  }

  function initButtons() {
    document.getElementById('toggleButton')?.addEventListener('click', toggleSidePanel);
    document.getElementById('addNewButton')?.addEventListener('click', addNewProject);
    document.getElementById('saveButton')?.addEventListener('click', saveBuildItem);
    
    
    document.getElementById('showAllButton')?.addEventListener('click', showAll);
    document.getElementById('zoomOutButton')?.addEventListener('click', zoomOut);
    document.getElementById('zoomInButton')?.addEventListener('click', zoomIn);
    document.getElementById('backButton')?.addEventListener('click', back);
    document.getElementById('forwardButton')?.addEventListener('click', forward);
    

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
    renderGanttView();
  }

  init();

  // Expose for manual re-init if needed
  window.buildit = {
    init
  };

})();
