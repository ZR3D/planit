(function () {
  'use strict';
    
  // --- Global Declarations ---  
  let noteData = {notes:[], currentNote:'', currentNoteId:''};
  const dom = {};

  // --- Constructor ---
  function Note(title, content, id){
    this.title = title; 
    this.content = content; 
    this.id = id || generateId();  
  }
 
  // --- Helper Functions ---
  function saveAndRender(){
    saveToLocalStorage();
    renderView();
  }
  
  function getNoteIndex(){
    return noteData.notes.findIndex(n => n.id === noteData.currentNoteId); 
  }

  function saveNote() {
    const currentNote = noteData.notes[getNoteIndex()];
    currentNote.title = dom.noteTitle.innerHTML.trim();
    currentNote.content = dom.noteCanvas.innerHTML;
    
    //if title changes update this
    populateNoteSelect();
    
    saveToLocalStorage();
  }
        
  function changeNote() {
    if(dom.noteSelect.value){
      noteData.currentNoteId = dom.noteSelect.value;
    }
    //noteData.currentNoteId = noteData.notes.findIndex(n => n.title === noteData.currentNote) || 0;
    saveAndRender(); 
  }

  // --- Render Functions ---
  function renderView(){ 
    if (noteData.notes.length === 0) {
      dom.noteMessage.textContent = 'Create a note by clicking the Add Note button';
      return;
    }
         
    if(!noteData.currentNoteId){
      noteData.currentNoteId = noteData.notes[0].id; //set to first 
    }
    
    console.log(getNoteIndex(), noteData.currentNoteId)
    
    const currentNote = noteData.notes[getNoteIndex()];
    dom.noteTitle.innerHTML = currentNote.title;
    dom.noteCanvas.innerHTML = currentNote.content;
    
    populateNoteSelect();
  }
  
  // --- Note Select ---
  function populateNoteSelect(){
    //Populate note dropdown
    dom.noteSelect.innerHTML = '';
    noteData.notes.forEach(note => {
      const option = document.createElement("option");
      option.text = note.title.replace(/&nbsp;/g,'');
      option.value = note.id;
      option.selected = (note.id===noteData.currentNoteId)? 'selected':'';
      dom.noteSelect.add(option);
    });
  }  
  
  function addNote(){
    const id = generateId();    
    noteData.notes.push(new Note('New Note', '<div>Type note here...</div>', id)); 
    noteData.currentNoteId = id;
    //noteData.currentNote = 'New Note';
    saveAndRender();    
  }

  function deleteNote(){
    showToast('note deleted', 'success');   
    noteData.notes = noteData.notes.filter(n => !(n.id === noteData.currentNoteId));
    noteData.currentNoteId = noteData.notes[0].id; //set to first
    saveAndRender();
  }
  



  // --- Save and Load ---
  function loadFromLocalStorage() {
    if (window.getPlanitSection) {
      const saved = getPlanitSection("noteit"); //planit.js
      if (saved?.notes) {
        try {
         noteData = saved;
        } catch (e) {
          console.warn("Could not parse saved noteit data:", e);
          noteData = [];
        }
      } else {
        const id = generateId();
        noteData.currentNoteId = id;
        noteData.notes.push(new Note('Note One', '<div>Type note here...</div>',id));
        noteData.notes.push(new Note('Note Two', '<div>Type note here...</div>',)); 
        saveAndRender();
      }
    }
  }

  function saveToLocalStorage() {
    if (window.updatePlanitSection) {
      updatePlanitSection("noteit", noteData); //planit.js
    }
  }
  
  // --- Import and Export ---    
  function exportData() {
    exportCardData(noteData, 'noteit'); //planit.js     
  } 
  
  function importData(event) {
    const file = event.target.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        noteData = JSON.parse(e.target.result);
        saveAndRender();
      };
      reader.readAsText(file);
    }
  }

  // --- Initialization ---
  function initDomReferences() {
    dom.noteMessage = document.getElementById('noteMessage'); 
    dom.noteTitle = document.getElementById('noteTitle');
    dom.noteCanvas = document.getElementById('noteCanvas');    
    dom.noteSelect = document.getElementById('noteSelect');
    
    dom.noteSelect?.addEventListener('change', changeNote);      
    dom.noteTitle?.addEventListener('input', saveNote); 
    dom.noteCanvas?.addEventListener('input', saveNote);

    dom.noteCanvas.addEventListener('paste', (e) => {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData('text');
      document.execCommand('insertText', false, text);
    });
  }

  function initButtons() {
    document.getElementById('toggleButton')?.addEventListener('click', toggleSidePanel);
    document.getElementById('addNoteButton')?.addEventListener('click', addNote);
    document.getElementById('deleteNoteButton')?.addEventListener('click',deleteNote);
    
    //Import Export Json Data
    document.getElementById('exportDataButton')?.addEventListener('click', exportData);
    const importDataButton = document.getElementById('importDataButton');
    const hiddenFileInput = document.getElementById('hiddenFileInput');
    importDataButton?.addEventListener("click", () => hiddenFileInput?.click());
    hiddenFileInput?.addEventListener("change", importData);
    
    
    document.querySelector('#emoji-btn').addEventListener('click', () => {
      
      //const emojiCode = '0x' + '1F603'
      const emojiCode = '0x' + '1F60D'
      
      const emoji = String.fromCodePoint(emojiCode);      
      const sel = window.getSelection();
      if (!sel.rangeCount) return;

      const range = sel.getRangeAt(0);
      range.deleteContents();

      const textNode = document.createTextNode(emoji);
      range.insertNode(textNode);

      // Move caret after the inserted emoji
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      sel.removeAllRanges();
      sel.addRange(range);
      saveNote();
    });
      
    
    
  }

  function init() {
    initDomReferences();
    initButtons();
    loadFromLocalStorage();
    renderView();
  }

  init();

  window.noteit = {
    init
  };
})();
