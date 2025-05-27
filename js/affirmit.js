(function () {
  'use strict';
  
  // --- Global Declarations ---
  const dom = {};
  let message = "May all world leaders wish for peace";
  let timer = false;

  // --- Helper Functions --- 
  function updateStatistics(counter, startCount){
    /* var htmlstr = "<div><div class=\"header\">total</div><div class=\"number\">" + counter + "</div></div>";
    htmlstr += "<div><div class=\"header\">years 108x a day</div><div class=\"number\">" + + "</div></div>";
    htmlstr += "<div><div class=\"header\">years daily</div><div class=\"number\">" +  + "</div></div>";
    htmlstr += "<div><div class=\"header\">today</div><div class=\"number\">" +  + "</div></div>";
    dom.statistics.innerHTML = htmlstr;*/
    dom.totalNumber.innerText  = counter;
    dom.yearsPerDay.innerText  = (counter/(365*108)).toFixed(2);
    dom.yearsDaily.innerText  = (counter/(365)).toFixed(2);
    dom.todayCount.innerText  = counter-startCount;
  }

  function addDiv(line){
    var id = "content_" + line;
    const chant = document.createElement('div');
    chant.id = id;
    chant.style = 'opacity:' + (Number(Math.random().toFixed(2)) + 0.2); 
    dom.chants.appendChild(chant)
    dom.currentDiv = document.getElementById(id);
  }

  function startChant(){
    
    clearInterval(timer);
    timer = false;
    
    var counter = localStorage.getItem("peace");
    var startCount = counter;
    updateStatistics(counter, startCount);
    var i = 0;
    timer = setInterval(frame, 40);
    var spaceCount = 0;
    var line = 0;
    addDiv(line);
    function frame() {
      if(spaceCount>0){
        spaceCount-=1;
      }else{
        if (i > message.length) {
          i = 0;
          spaceCount = 5;
          counter++;
          updateStatistics(counter, startCount);
          localStorage.setItem("peace", counter);
          line++;
          //getContainerSize();
          const rect = dom.chants.getBoundingClientRect()
          if(window.innerHeight<=rect.top+rect.height+22){
            dom.chants.innerHTML = "";
            line = 0;
          }
          addDiv(line);
        }else{
          var letter = message.charAt(i);
          if(letter == " "){
            spaceCount = 5; //cycles through 5 ticks between words
          }
           try {
            dom.currentDiv.innerHTML += letter;
          } catch (e) {
        return false;
        }       
          i++;
        }
      }
    }
  }

  // --- Initialization ---
  function initDomReferences() {
    dom.container = document.querySelector(".container");
    dom.statistics = document.querySelector(".statistics");
    dom.chants = document.querySelector(".chants");   
    dom.currentDiv = null;  
    dom.totalNumber = document.getElementById('totalNumber');
    dom.yearsPerDay = document.getElementById('yearsPerDay');
    dom.yearsDaily = document.getElementById('yearsDaily');
    dom.todayCount = document.getElementById('todayCount');    
  }

  function initButtons() {
    document.getElementById('toggleButton')?.addEventListener('click', toggleSidePanel);
  }

  function init() {
    initDomReferences();
    //loadFromLocalStorage();
    initButtons();
    //renderView();
    startChant();
  }

  init();

  // Expose for manual re-init if needed
  window.affirmit = {
    init
  };
})();
