(function () {
  'use strict';
  
  // --- Global Declarations ---
  let taskData = [];
  let currentTaskId = [];
  let currentMonday = getMonday(new Date()); //planit.js
  const statuses = ["not-started", "complete", "started", "ignore"];
  const dom = {};
    
  // --- Helper Functions ---     
  function Task(taskTitle, date, status, repeat){
    this.title = taskTitle;
    this.date = date;            
    this.status = status;
    this.repeat= repeat;  
    this.id = generateId();
  }
  
 function updateSidePanel(data) {
    currentTaskId = data.id;
    dom.panelTitle.value = data.title;
    dom.panelStatus.value = data.status;
    dom.panelRepeat.value = data.repeat;
    //dom.panelTags.value = Array.isArray(data.tags) ? data.tags.join(', ') : data.tags || '';
  }
    
  function saveAndRender() {
    saveToLocalStorage();
    renderView();
  }
    
  // --- Render Functions --- 
  function renderView() {
    const allColumn = document.getElementById("allColumn");     
    const dateSelect = document.getElementById("dateSelector");
    allColumn.innerHTML = "";
    const day2 = new Date(currentMonday);
    const monday = formatDate(day2);
    var popuateDateSelect = false;
    
    if(dateSelect.length!=0){ //is populated
      if(monday!=dateSelect[0].value){ //is not equal
        dateSelect.innerHTML = ""; 
        popuateDateSelect = true;
      }
    }else{
      popuateDateSelect = true;
    }

    for (let i = 0; i < 7; i++) {
      const day = new Date(currentMonday);
      day.setDate(day.getDate() + i);
      const dayStr = formatDate(day);
      const dayTitle = day.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
      const header = document.createElement("div");
      header.className = "day-header";
      header.textContent = dayTitle;    

      const block = document.createElement("div");
      block.className = "task-block task-list";
      block.dataset.date = dayStr; // also needed for drag-and-drop to know the date!

      const tasks = taskData.filter(task => task.date === dayStr);
      tasks.forEach(task => {
      const item = document.createElement("div");
      item.className = "task-item " + task.status;
      item.dataset.taskId = task.id; 

      const repeat = document.createElement("div");
      repeat.className = "task-repeat";
      repeat.innerHTML = task.repeat === "yes" ? '<svg class="icon"><use href="#repeat"> /></svg>':'<svg class="icon"><use href="#no-repeat"> /></svg>';
      repeat.onclick = (e) => {
        e.stopPropagation();
        toggleRepeat(task, repeat);
      };

      const del = document.createElement("div");
      del.innerHTML = '<svg class="icon"><use href="#delete"> /></svg>';
      del.className = "task-repeat";
      del.onclick = (e) => {
        e.stopPropagation();
        deleteTask(task);
      };

      const status = document.createElement("div");
      status.className = "task-status";
      status.innerHTML = statusIcon(task.status);
      status.onclick = () => toggleStatus(task);

      const title = document.createElement("div");
      title.className = "task-title";
      title.textContent = task.title;
      title.contentEditable='true';
      title.onblur = () => updateTaskTitle(task, title);

      const handle = document.createElement("div");
      handle.className = "drag-handle";
      handle.innerHTML = '<svg class="icon"><use href="#move"> /></svg>';

      item.appendChild(del);   
      item.appendChild(repeat);
      item.appendChild(status);
      item.appendChild(title);
      item.appendChild(handle);
      block.appendChild(item);      
      });

      if(popuateDateSelect){
      dateSelect.innerHTML += '<option value="' + dayStr + '">' + dayTitle + '</option>';
      }

      const dayBlock = document.createElement("div");
      dayBlock.className = "day-block";
      dayBlock.appendChild(header);
      dayBlock.appendChild(block);
      allColumn.appendChild(dayBlock);

    }
    initializeSortable(); // Add this at the end
    updateWeeklyProgress();
  }

  // ---Task Item Change Properties ---
  function onComplete(){
    //check all jobs finished for day      
  }

 function toggleStatus(task) {
  const currentIndex = statuses.indexOf(task.status);
  const nextIndex = (currentIndex + 1) % statuses.length;
  task.status = statuses[nextIndex];
  if(task.status=="complete"){
    showToast(`good job!`, 'success');     
  }
  updateSidePanel(task);
  saveAndRender();
}

  function toggleRepeat(task, el) {
    const img = el.querySelector('img');
    const isRepeat = task.repeat === "yes";
    task.repeat = isRepeat ? "no" : "yes";
    saveAndRender();
  }
    
  function deleteTask(task) {
    showToast(`task: ${task.title} deleted`, 'success');   
    taskData = taskData.filter(t => !(t.id === task.id));
    saveAndRender();
  }  
  
  function updateTaskTitle(task, title){
    const taskTitle =  title.innerHTML.trim();
    task.title = taskTitle
    saveAndRender();
  }    
    
    function statusIcon(status) {
    return `<svg class="icon"><use href="#${status}"> /></svg>`;    
  }
    
  // --- Nav Buttons ---
  function nextWeek() {
    currentMonday.setDate(currentMonday.getDate() + 7);
    renderView();
  }

  function prevWeek() {
    currentMonday.setDate(currentMonday.getDate() - 7);
    renderView();
  }

  function saveTasks() {
    const blob = new Blob([JSON.stringify(taskData, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "tasks.json";
    a.click();
  }

  function loadData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        taskData = JSON.parse(e.target.result);
        saveAndRender();
      } catch (err) {
        alert("Failed to load file: Invalid format.");
      }
    };
    reader.readAsText(file);
  }

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
      taskData.filter(t => t.date === dateStr && t.repeat === "yes").forEach(t => {    
        //newWeek.push({ ...t, date: nextDateStr, status: "not-started",id:generateId()});
        newWeek.push(new Task(t.title,nextDateStr,"not-started",t.repeat));
      });
    }
    taskData = taskData.concat(newWeek);
  saveAndRender();      
  }

  function addTask(button, dateStr) {
    const taskStr = document.getElementById("taskStr");
    let taskTitle = taskStr.value.trim();
    const dateSelectValue = document.getElementById("dateSelector").value;
    if (!taskTitle){
      taskTitle = "New Task"
    }
    taskData.push(new Task(taskTitle,dateSelectValue,"not-started","no"));
    taskStr.value = "";
    saveAndRender();
  }
  
  // --- Drag and Drop ---
  function initializeSortable() {
    document.querySelectorAll('.task-list').forEach(listEl => {
    new Sortable(listEl, {
    group: 'shared-tasks',
    handle: ".drag-handle",
    //animation: 150,
    onEnd: (evt) => {
      const taskEl = evt.item;
      const newDate = evt.to.dataset.date;
      const taskId = taskEl.dataset.taskId;
      const currentTaskData = taskData.find(t => t.id === taskId) || { date: null };
      const prevTaskEl = taskEl.previousElementSibling;
      const nextTaskEl = taskEl.nextElementSibling;

      // Update task date if it has changed
      if (currentTaskData.date !== newDate) {
        currentTaskData.date = newDate;
      }

      let referenceTaskId = null;
      let placeAfter = true; // default behavior

      // Determine where to position the moved task relative to its siblings
      if (!prevTaskEl && nextTaskEl) {
        // First in the list – place before the next sibling
        console.log("Moved to top");
        referenceTaskId = nextTaskEl.dataset.taskId;
        placeAfter = false;
      } else if (prevTaskEl) {
        // Has a previous sibling – place after it
        console.log("Moved after previous task");
        referenceTaskId = prevTaskEl.dataset.taskId;
        placeAfter = true;
      }
      // Reorder in taskData if a reference point is found
      if (referenceTaskId) {
        console.log(`Moving task ${taskId} ${placeAfter ? 'after' : 'before'} ${referenceTaskId}`);
        moveTaskBeforeOrAfter(taskData, taskId, referenceTaskId, placeAfter);
      }
      saveAndRender();
    }
    });
    });
  }

  Sortable.create(document.getElementById('del'), {
      group: 'shared-tasks',
      onAdd: function (evt) {    
    const taskEl = evt.item;
    const taskId = taskEl.dataset.taskId;
    const task = taskData.find(t => t.id === taskId);
    console.log(taskId, task);
    showToast(`task: ${task.title} deleted`, 'success');  
    deleteTask(task);
        evt.item.remove();       
      }
    });

  function moveTaskBeforeOrAfter(taskData, currentId, referenceId, placeAfter = false) {
    console.log(placeAfter)
    if (currentId === referenceId) return; // Nothing to do

    const fromIndex = taskData.findIndex(t => t.id === currentId);
    const refIndex = taskData.findIndex(t => t.id === referenceId);

    if (fromIndex === -1 || refIndex === -1) return; // IDs not found

    const [task] = taskData.splice(fromIndex, 1); // Remove the task

    // Adjust target index depending on desired position and direction of move
    let insertIndex = refIndex;
    if (placeAfter) {
      insertIndex += fromIndex < refIndex ? 0 : 1;
    } else {
      insertIndex += fromIndex < refIndex ? -1 : 0;
    }

    // Clamp insertIndex to ensure it's within valid bounds
    insertIndex = Math.max(0, Math.min(insertIndex, taskData.length));

    taskData.splice(insertIndex, 0, task);
  }

  // --- Progress Bar --- 
  function updateWeeklyProgress() {
    const weekStart = new Date(currentMonday);    
    const dates = [];

    // Build date list for the week
    for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    //console.log(date)
    date.setDate(weekStart.getDate() + i);
    const dateStr = formatDate(date);
    dates.push(dateStr);
    }
    // Count total and completed tasks
    let total = 0;
    let complete = 0;
    let started = 0;

    dates.forEach(dater => {
    const tasks = taskData.filter(t => t.date === dater && t.status !== 'ignore') || [];    
    total += tasks.length;
    complete += tasks.filter(t => t.status === "complete").length;
    started += tasks.filter(t => t.status === "started").length;
    });
    const percent = total > 0 ? Math.round((complete / total) * 100) : 0;
    const startedPercent = total > 0 ? Math.round((started / total) * 100) : 0;
    if (dom.fill) dom.fill.style.width = percent + "%";
    if (dom.startedFill) dom.startedFill.style.width = startedPercent + "%";
    if (dom.text) dom.text.textContent = `${complete} of ${total} tasks complete  ${percent}% ${started} started`;
    //console.log(fill, percent)
    if (percent === 100) triggerConfetti();
}

  // --- Confetti ---
  function triggerConfetti() {
    const confetti = document.getElementById('confetti');
    confetti.innerHTML = ''; // Clear previous
    const emojis = ["🎉", "✨", "🎊", "🥳", "💫", "🌟"];
    const num = 30;

    for (let i = 0; i < num; i++) {
    const el = document.createElement("div");
    el.className = "confetti-emoji";
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = Math.random() * 100 + "vw";
    el.style.top = "-2rem";
    el.style.animationDelay = (Math.random() * 0.5) + "s";
    confetti.appendChild(el);
    }
    setTimeout(() => { confetti.innerHTML = ""; }, 3000); // Cleanup
  } 
  
  // --- Save and Load ---
  function loadFromStorage() {    
    if (window.getPlanitSection) {
      const taskitData = getPlanitSection("taskit");
        if (taskitData.tasks) {
          try {
        taskData = taskitData.tasks;    
          } catch (e) {
            console.warn("Could not parse saved tasks:", e);
            taskData = [];
          }
        } else {
      const day = new Date(currentMonday);
      const monday = formatDate(day);
      day.setDate(day.getDate() + 1);
      const tuesday = formatDate(day);      
          taskData = [
          new Task("Clean fridge",monday,"complete","yes"),
          new Task("Make bread",monday,"not-started","no"),
          new Task("Dishes",tuesday,"not-started","yes"),
          new Task("Water Garden",tuesday,"complete","no")
          ];
          saveToLocalStorage();
        }
    }
   }

  function saveToLocalStorage() {
    if (window.updatePlanitSection) {
      updatePlanitSection("taskit", {
      tasks: taskData
      });
    }
  }
  
  // --- Import and Export ---    
  function exportData() {
    exportCardData(taskData, 'taskit'); //planit.js     
  } 
  
  function importData(event) {
    const file = event.target.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        taskData = JSON.parse(e.target.result);
        saveAndRender();        
      };
      reader.readAsText(file);
    }
  }
    
  // --- Initialization ---
  function initDomReferences() {
    //dom.taskView = document.getElementById('taskView');
    //dom.sidePanel = document.getElementById('sidePanel');
    dom.panelTitle = document.getElementById('title');
    dom.panelStatus = document.getElementById('status');
    dom.panelRepeat = document.getElementById('panelRepeat');    
    dom.fill = document.querySelector('.progress-fill');
    dom.startedFill = document.querySelector('.started-fill');
    dom.text = document.querySelector('.progress-text');
  }
  
  function initButtons(){
    document.getElementById("prevWeekBtn")?.addEventListener("click", prevWeek);
    document.getElementById("nextWeekBtn")?.addEventListener("click", nextWeek);
    document.getElementById("copyRepeatsBtn")?.addEventListener("click", copyRepeats);
    document.getElementById("saveTasksBtn")?.addEventListener("click", saveTasks);
    document.getElementById('exportDataButton')?.addEventListener('click', exportData);
    
    //Import Json Data
    const importDataButton = document.getElementById('importDataButton');
    const hiddenFileInput = document.getElementById('hiddenFileInput');
    importDataButton?.addEventListener("click", () => hiddenFileInput?.click());
    hiddenFileInput?.addEventListener("change", importData);
    
    //by class  
    document.querySelectorAll(".add-task-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const dayStr = btn.getAttribute("data-day");
      addTask(btn, dayStr);
    });
    });
        
    //side panel  
    const sidePanel = document.getElementById('sidePanel');
    document.getElementById("toggleButton")?.addEventListener("click", toggleSidePanel); 
  }

  function init(){
    initDomReferences();
    loadFromStorage();    
    initButtons();
    renderView();  
  }

  init();

window.taskit = {
  init() {
  init();   
  }
};

})();
