(function () {
  'use strict';

  // --- Global Declarations ---
  let currentRecipeId = 0;
  let recipeData = {recipes:[]};
  const dom = {};  
 
  // --- Constructor Functions ---
  function Recipe(title,source,type,ingredients,methods,tags,id){
    this.title = title;
    this.source = source || '';
    this.type = type || '';
    this.ingredients = ingredients || [];
    this.methods = methods || [];
    this.tags = tags || [];
    this.id = id || generateId();
   }

  function Ingredient(title, qty, unit, inst, original, type, id){
    this.title = title;
    this.qty = qty || '';
    this.unit = unit || '';
    this.inst = inst || '';
    this.original = original || '';
    this.type = type || '';
    this.id = id || generateId();
   }
      
  // --- Helper Functions ---
  function saveAndRender() {
    saveToLocalStorage();
    renderView();
  }  
  
  function createDiv(text, className, isEditable){
    const div = document.createElement('div');
    if(text){
      div.textContent = text;
    }    
    if(className){
      div.className = className;  
    }
    if(isEditable){    
      div.contentEditable='true';
    }        
    return div;
  }
  
  function createButton(text, className){
    const button = document.createElement('button');
    button.textContent = text;
    button.addEventListener('mousedown', e => e.preventDefault());     
    return button;
  }

  function addNewRecipe(){
    const title = (dom.titleInput.value)?  dom.titleInput.value:'New Recipe';   
    const index = recipeData.recipes.push(new Recipe(title))-1;
    currentRecipeId = index;
    saveAndRender(); 
  }
  
  function changeRecipe(recipeId, index){
    console.log(recipeId, index);
    currentRecipeId = index;
    saveAndRender();   
  }
  
  function addIngredient(recipeId){
    console.log(recipeId);
    recipeData.recipes[currentRecipeId].ingredients.push(new Ingredient('New ingredient'));
    saveAndRender();
  }
  
  function deleteIngredient(index){
    recipeData.recipes[currentRecipeId].ingredients.splice(index, 1);
    saveAndRender();
  }
  
  function deleteRecipe(){
    recipeData.recipes.splice(currentRecipeId, 1);
    saveAndRender();   
  }
  
  function deleteMethod(index){
    recipeData.recipes[currentRecipeId].methods.splice(index, 1);
    saveAndRender();
  } 

  function addMethod(recipeId){
    console.log(recipeId);
    recipeData.recipes[currentRecipeId].methods.push('New method');
    saveAndRender();
  }
  
  function updateIngredientProperty(propName, el, index){
    recipeData.recipes[currentRecipeId].ingredients[index][propName] = el.innerText.trim();
    saveAndRender();
  }
  
  function updateMethod(el, index){
    recipeData.recipes[currentRecipeId].methods[index] = el.innerText.trim();
    saveAndRender();
  }
  
  
  function updateRecipeProperty(propName, el){
    recipeData.recipes[currentRecipeId][propName] = el.innerText.trim();
    saveAndRender();
  }
  
  function isOdd(num){
    return num % 2;  
  }
  
  function niceNum(num, decimalPlaces){
    const numType = typeof num
    if(numType == "string") num = Number(num);
    if(numType == "undefined" || num == null) num = 0;
    decimalPlaces = (decimalPlaces!==undefined)? decimalPlaces:3;
    num = (Number.isInteger(num))? Number(num):Number(num.toFixed(decimalPlaces));
    return parseFloat(num); //removes trailing zeros
  }

  //trims and removes multiple white spaces between words
  function niceString(str){
    str = str.replace(/^\s+|\s+$|\s+(?=\s)/, '');
    return str;   
  }
  
  
  // --- Parse Recipe Functions ---
  function parseRecipe() {
    dom.parseOutput.innerHTML = '';
    const title = dom.recipeTitle.value.trim() || "New Recipe";
    const text =  dom.inputText.value.trim();
    const lines = text.split(/\n+/);
    const ingredients = [];
    let methods = [];
    let inIngredients = false
    let inMethod = false;
    
    for (let line of lines) {
      line = line.trim();
      if(line!=''){ //not blank
        if (line.toLowerCase().startsWith("method") || line.toLowerCase().startsWith("instruction")) {
          inMethod = true;
          continue;
        }
        if (inMethod) {
          methods.push(line);
        } else {
          if(!line.toLowerCase().startsWith("ingredients")){
            const parsed = parseIngredientFlexible(line);
            const ingredient = new Ingredient(parsed.ingredient, niceNum(parsed.qty), parsed.unit, parsed.inst, parsed.normalized);
            ingredients.push(ingredient);
          }
        }
      }
    }
    const recipe  = new Recipe(title, '', 'main', ingredients, methods, 'imported');

    // Output
    dom.parseOutput.textContent = JSON.stringify(recipe, null, 2);

    //Save
    recipeData.recipes.push(recipe);
    saveAndRender();
  }  
  
  function normalizeQuantity(ingredient) {
    
    const lower = ingredient.toLowerCase().trim();

    // 1. Handle multipliers like '7 x 60g'
    const multiplierMatch = lower.match(/(\d+)\s*[x×*]\s*(\d+\.?\d*)\s*([a-z]+)/i);
    if (multiplierMatch) {
      const count = parseFloat(multiplierMatch[1]);
      const amount = parseFloat(multiplierMatch[2]);
      const unit = multiplierMatch[3];
      const total = count * amount;
      const rest = ingredient.slice(multiplierMatch[0].length).trim();
      return `${total}${unit} ${rest}`;      
    }

    // 2. Handle ranges like '5 - 6', '0.25 to 0.5'
    const rangeMatch = ingredient.match(/(\d*\.?\d+)\s*(?:To|to|-)\s*(\d*\.?\d+)/);
    if (rangeMatch) {
      const start = parseFloat(rangeMatch[1]);
      const end = parseFloat(rangeMatch[2]);
      const avg = (start + end) / 2;
      const rest = ingredient.replace(rangeMatch[0], '').trim();
      console.log(rangeMatch[0])
      return `${avg} ${rest}`;
    }

    // 3. Return unchanged if no match
    return ingredient;
  } 
  
  // --- Ingredients ---  
  function standardiseUnits(unit) {
    // capitalisation required for teaspoon units, otherwise case insensitive
    if(unit==='T' || unit==='Ts'){
     unit = 'tbsp'; 
    }
    const map = {
      // tablespoons
      'tablespoon':'tbsp', 'tablespoons':'tbsp', 'tbs':'tbsp',
      // teaspoons
      'teaspoon': 'tsp', 'teaspoons': 'tsp','t':'tsp','ts':'tsp','tspn':'tsp',
      // kilograms
      'kg':'kilogram', 'kgs':'kilograms', 'kilo':'kilogram', 'kilos':'kilograms',    
      // grams
      'g':'grams', 'gs':'grams', 'gm':'grams', 
      // millilitres
      'ml':'mls', 'mls':'mls', 'millitres':'mls','millilitres':'mls', 
      //litres
      'liter':'litre','liters':'litres'
      };
    return map[unit.toLowerCase()] || unit.toLowerCase();
  }
  function normalizeFractionsInString(input) {
    const unicodeFractions = {
      '¼': 0.25,
      '½': 0.5,
      '¾': 0.75,
      '⅐': 1/7,
      '⅑': 1/9,
      '⅒': 1/10,
      '⅓': 1/3,
      '⅔': 2/3,
      '⅕': 1/5,
      '⅖': 2/5,
      '⅗': 3/5,
      '⅘': 4/5,
      '⅙': 1/6,
      '⅚': 5/6,
      '⅛': 1/8,
      '⅜': 3/8,
      '⅝': 5/8,
      '⅞': 7/8
    };

    // Convert mixed numbers with unicode fraction, e.g. "1 ½"
    input = input.replace(/(\d+)\s*([¼½¾⅐⅑⅒⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞])/g, (match, whole, frac) => {
      return (parseInt(whole, 10) + unicodeFractions[frac]).toString();
    });

    // Convert unicode fractions on their own, e.g. "½ cup"
    input = input.replace(/([¼½¾⅐⅑⅒⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞])/g, (match, frac) => {
      return unicodeFractions[frac].toString();
    });

    // Convert mixed numbers like "1 1/2"
    input = input.replace(/(\d+)\s+(\d+)\/(\d+)/g, (match, whole, num, den) => {
      return (parseInt(whole, 10) + parseInt(num, 10) / parseInt(den, 10)).toString();
    });

    // Convert simple fractions like "1/2"
    input = input.replace(/(\d+)\/(\d+)/g, (match, num, den) => {
      return (parseInt(num, 10) / parseInt(den, 10)).toString();
    });

    return input;
  }
  
  // Fix brackets, double measurements, commas
  function checkDoubleUnits(input, unitPattern){
    const line = {filtered:input, inst:'', type:''};
    
    // Separate brackets 
    const regexBracket = new RegExp('((?:\\()(.*?)(?:\\)))');
    const matchBracket = line.filtered.match(regexBracket);  
    if(matchBracket){
      line.filtered = line.filtered.replace(matchBracket[1],''); //(1 cup)
      line.inst = matchBracket[2]; //1 cup
      line.type = 'bracket';  
    }
        
    // Comma
    const regexComma = new RegExp('(,.+)');
    const matchComma = line.filtered.match(regexComma);  
    if(matchComma){
      line.filtered =  line.filtered.replace(matchComma[0],''); 
      line.inst = matchComma[0].replace(',','').trim(); //, blah blah
      line.type = 'comma';  
    }
    
    //Or
    const regexOr = new RegExp('(?:\\s+or|Or\\s)(.+)');
    const matchOr = line.filtered.match(regexOr);  
    if(matchOr){
      line.filtered =  line.filtered.replace(matchOr[0],''); 
      line.inst = matchOr[0].replace(',','').trim();//or 1 sweet potato
      line.type = 'or';  
    }    
    
    // Find double measurements 
    const regex = new RegExp(`(\\d+(?:\\.\\d+)?)(?:\\s*)(${unitPattern})`, 'g');    
    const match = line.filtered.match(regex);
    if(match){
      if(match.length > 1){
        //user could prioritise weight or cup mesurements
        //const item = (match[1].includes('cup'))? match[0]:match[1];
        line.filtered =  line.filtered.replace(match[1],''); 
        line.inst = match[1]; 
        line.type = 'double measurement'; 
      }       
    }
    line.filtered = line.filtered.trim();
    console.log(line, input);
    return line;        
  }

  function parseIngredientFlexible(input) {
    const units = ['mls','ml','g','gm','grams','kg','kilos','t','T','Cup','cup','Cups','cups','tsp','tbsp','Teaspoon','Tablespoon','Teaspoons','Tablespoons','Ts','ts','Tbs','tbs','litres','Tspn'];
    const unitPattern = units.join('|');

    const original = input.replace('▢', '').trim(); //checkbox  
    const normalized = normalizeFractionsInString(original);
    input = normalizeQuantity(normalized); //fixes 7 x 60, 
    const checkDouble  = checkDoubleUnits(input, unitPattern);
    input = normalizeFractionsInString(checkDouble.filtered);
    
    const result = {
      qty: null,
      unitOriginal: null,
      unit: null,
      inst: checkDouble.inst,
      ingredient: checkDouble.filtered,
      normalized: normalized,
      original: original,
    };
        
    const regex = new RegExp(
      // Pattern 1: quantity + unit + optional 'of' + ingredient
      `(?:^|\\b)(\\d+(?:\\.\\d+)?)(?:\\s*)(${unitPattern})(?:\\s+of)?\\s+(.*)` +
      // Pattern 2: ingredient + quantity + unit
      `|(?:^|\\b)(.*?)(?:\\s+)(\\d+(?:\\.\\d+)?)(?:\\s*)(${unitPattern})(?:\\b|$)` +
      // Pattern 3: quantity + ingredient (no known unit)
      `|(?:^|\\b)(\\d+(?:\\.\\d+)?)(?:\\s+)([a-zA-Z][a-zA-Z ]*)` +
      // Pattern 4: ingredient + quantity (no known unit)
      `|(?:^|\\b)([a-zA-Z][a-zA-Z ]*)(?:\\s+)(\\d+(?:\\.\\d+)?)`,
      'i'
    );

    const match = input.match(regex);
    
    if(match){  
      //console.log(match);
      if (match[1] && match[2] && match[3]) {
        // Format: 200ml milk
        result.qty =  parseFloat(match[1]),
        result.unitOriginal = match[2];
        result.unit =  standardiseUnits(match[2]),
        result.ingredient =  match[3].trim()
      } else if (match[4] && match[5] && match[6]) {
        // Format: milk 200ml
        result.qty =  parseFloat(match[5]),
        result.unitOriginal =  match[6],
        result.unit =  standardiseUnits(match[6]),
        result.ingredient =  match[4].trim()
      } else if (match[7] && match[8]) {
        // Format: 2 onions
        result.qty =  parseFloat(match[7]),
        result.unit =  'each',
        result.ingredient = match[8].trim()
      } else if (match[9] && match[10]) {
        // Format: 2 onions
        result.qty =  parseFloat(match[10]),
        result.unit =  'each',
        result.ingredient = match[9].trim()
      }
    }
    
    let checkRemainderText = result.normalized.replace(result.ingredient,'').replace(result.qty,'').replace(result.unitOriginal,'').replace(result.inst,'').trim();
    if(checkRemainderText.length!=0){
      checkRemainderText = checkRemainderText.replace(/^\,/, '').replace(/^Of$/i, '').replace(/\((\s+)?\)/, ''); 
      if(checkRemainderText.length!=0){
        result.inst += ' ' + checkRemainderText;
        result.inst = result.inst.trim();
      }
    }
    return result;
  }
  


  // --- Render Functions ---
  function renderView(){
    renderRecipe();
    renderRecipePicker();
  }
  
   function renderRecipe(){
    
    const recipeContainer = dom.recipeContainer;
     
    const recipe = recipeData.recipes[currentRecipeId];
    recipeContainer.innerHTML = '';
        
    const recipeNumber = createDiv(currentRecipeId.toString(), 'recipe-heading');
    const recipeTitle = createDiv(recipe.title, 'recipe-heading', true);
    recipeTitle.onblur = () => updateRecipeProperty('title', recipeTitle);
    const recipeType = createDiv(recipe.type, 'recipe-heading', true);
    recipeType.onblur = () => updateRecipeProperty('type', recipeType);
    recipeType.style = 'grid-column: span 2;';  
    const recipeSource = createDiv(recipe.source, 'recipe-heading', true);
    recipeSource.onblur = () => updateRecipeProperty('source', recipeSource);
    
    const deleteHeading = createDiv('', 'recipe-heading inline-tools');
    const deleteRecipeSvg = createSvg('delete', 'icon');
    deleteRecipeSvg.addEventListener('mousedown', e => e.preventDefault()); 
    deleteRecipeSvg.onclick = () => deleteRecipe();  
    
   
    recipeContainer.appendChild(recipeNumber);  
    recipeContainer.appendChild(recipeTitle);
    recipeContainer.appendChild(recipeType);
    recipeContainer.appendChild(recipeSource);
    deleteHeading.appendChild(deleteRecipeSvg);
    recipeContainer.appendChild(deleteHeading);

    const ingredientsHeading = createDiv('Ingredients', 'ingredients-method-heading');
    ingredientsHeading.style = 'grid-column: span 5;'; 
        
    const ingredientButtonContainer = createDiv('', 'ingredients-method-heading inline-tools'); 
    
    const addIngredientButton = createButton('+ add new ingredient', '');
    addIngredientButton.onclick = () => addIngredient(recipe.index);
    ingredientButtonContainer.appendChild(addIngredientButton);
    recipeContainer.appendChild(ingredientsHeading);
    recipeContainer.appendChild(ingredientButtonContainer);  
      
    // Ingredients
    recipe.ingredients.forEach((ingredient, index) => {
      const className = (isOdd(index))? 'is-odd':'is-even';   
      const ingredientQty = createDiv(ingredient.qty, className, true);
      ingredientQty.onblur = () => updateIngredientProperty('qty', ingredientQty, index);
      
      const ingredientUnit = createDiv(ingredient.unit, className, true);
      ingredientUnit.onblur = () => updateIngredientProperty('unit', ingredientUnit, index);
      
      const ingredientTitle = createDiv(ingredient.title, className, true);
      ingredientTitle.onblur = () => updateIngredientProperty('title', ingredientTitle, index);      
      
      const ingredientInst = createDiv(ingredient.inst, className, true);
      ingredientInst.onblur = () => updateIngredientProperty('inst', ingredientInst, index); 
      
      ingredientInst.style = 'grid-column: span 2;';
      
      const editContainer = createDiv('', className + ' inline-tools')
      
      
      //const deleteIngedientButton = createButton('delete', '');
      //deleteIngedientButton.onclick = () => deleteIngredient(index);
      
      const deleteSvg = createSvg('delete', 'icon');
      deleteSvg.addEventListener('mousedown', e => e.preventDefault()); 
      deleteSvg.onclick = () => deleteIngredient(index);
      
      editContainer.appendChild(deleteSvg); 

      recipeContainer.appendChild(ingredientQty);  
      recipeContainer.appendChild(ingredientUnit);
      recipeContainer.appendChild(ingredientTitle);
      recipeContainer.appendChild(ingredientInst);
      recipeContainer.appendChild(editContainer); 
          
     });

    // Method
    const methodHeading = createDiv('Method', 'ingredients-method-heading');
    methodHeading.style = 'grid-column: span 5;';
    
    const methodButtonContainer = createDiv('', 'ingredients-method-heading inline-tools');
    const addMethodButton = createButton('+ add new method', '');
    addMethodButton.onclick = () => addMethod(recipe.index);
    methodButtonContainer.appendChild(addMethodButton);
    
    recipeContainer.appendChild(methodHeading);  
    recipeContainer.appendChild(methodButtonContainer); 
    
    recipe.methods.forEach((method,index) => {
      const className = (isOdd(index))? 'is-odd':'is-even';
      const methodLine = createDiv(method, className, true);
      methodLine.style = 'grid-column: span 5;';
      methodLine.onblur = () => updateMethod(methodLine, index);  
      
      const editContainer = createDiv('', className + ' inline-tools')
      
      //const deleteMethodButton = createButton('delete', '');
      //deleteMethodButton.onclick = () => deleteMethod(index);
      
      
      const deleteSvg = createSvg('delete', 'icon');
      deleteSvg.addEventListener('mousedown', e => e.preventDefault()); 
      deleteSvg.onclick = () => deleteMethod(index);
          
      
      editContainer.appendChild(deleteSvg);   
       
      recipeContainer.appendChild(methodLine);
      recipeContainer.appendChild(editContainer);         
    });    
  }
  
  function renderRecipePicker(){
    dom.recipePicker.innerHTML = '';
    recipeData.recipes.forEach((recipe,index) => {
    const recipeBox = createDiv(recipe.title, '');
    recipeBox.onclick = () => changeRecipe(recipe.id, index);
    dom.recipePicker.appendChild(recipeBox);  
    })
  }

  // --- Import and Export ---    
  function exportData() {
    exportCardData(recipeData, 'recipeit'); //planit.js     
  } 
  
  function importData(event) {
    const file = event.target.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        recipeData = JSON.parse(e.target.result);
        saveAndRender();
      };
      reader.readAsText(file);
    }
  }
  
  
  // --- Save and Load ---
  function loadFromLocalStorage() {
    if (window.getPlanitSection) {
      const saved = getPlanitSection("recipeit"); //planit.js
      if (saved?.recipes) {
        try {
          recipeData.recipes = saved.recipes;
        } catch (e) {
          console.warn("Could not parse saved recipeit data:", e);
        }
      } else {        
        recipeData.recipes = [new Recipe('Ho Fun Noodles','Home','main',[
          new Ingredient('Rice Flour', 1, 'cup'),
          new Ingredient('Tapioca Flour', 0.5, 'cups'),
          new Ingredient('Water', 1.5, 'cups'),
          new Ingredient('Oil', '', '','for spraying tray and separating noodles')        
        ],[
          'Mix stand mixer for 5 minutes with enough water to form dough.',
          'Then slowly add the water to make paste then rest for 1hr.',
          'Cook ladels of paste in non-stick pan five minutes each oil and layer and slice.'          
        ],'main')];
        saveToLocalStorage();
      }
    }
  }

  function saveToLocalStorage() {
    if (window.updatePlanitSection) {
      updatePlanitSection("recipeit", recipeData); //planit.js
    }
  }


  // --- Initialization ---
  function initDomReferences() {
    dom.recipeContainer = document.getElementById('recipeContainer');
    dom.recipePicker = document.getElementById('recipePicker');
    dom.titleInput = document.getElementById('titleInput');
    dom.recipeTitle = document.getElementById('recipeTitle');
    dom.inputText = document.getElementById('inputText');
    dom.parseOutput = document.getElementById('parseOutput');

  }

  function initButtons() {
    document.getElementById('toggleButton')?.addEventListener('click', toggleSidePanel);
    document.getElementById('parseRecipeButton')?.addEventListener('click', parseRecipe);
    
    dom.addNewButton =  document.getElementById('addNewButton');
    dom.addNewButton?.addEventListener('mousedown', e => e.preventDefault());
    dom.addNewButton?.addEventListener('click', addNewRecipe);
    
    
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

  window.recipeit = {
    init
  };
})();
