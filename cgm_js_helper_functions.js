const findColExp = /col-[\w]+-[0-9]+/ig;

// Clear select elements of selected values
function clearSelectElements(selector){
    $(selector).each(function(){
       $(this).find('option').attr('selected',false);
       $(selector + " option[value='']").attr('selected', true);
    });
}

// Search multiple select elements and select given value
function selectValMultipleElements(selector, val){
    $(selector + " option[value='" + val + "']").removeClass('hidden');
    $(selector + " option[value='" + val + "']").attr('selected', true);
}

// Disable options from being selected.  One line function seems unnecessary,
// but it's easier to type the function name than the contents
function hideValMultipleElements(selector, val){
    $(selector + " option[value='" + val + "']").addClass('hidden');
}

// Dynamically change font size of given element
function changeFontSize(element, sizeIn){
    var currentFont = element.style.fontSize.replace("px", "");
    return (parseInt(currentFont) + parseInt(sizeIn) + "px");
}

// Takes a string, replaces px and returns an int
function getIntFromStyle(style){
    style = style.replace("px", "");
    return (parseInt(style));
}

//**** BOOTSTRAP HELPER FUNCTIONS ****

// Parse the class name of a given element and return an array of its bootstrap sizes
function getElementSizes(element){
    var classString = element.className;
    var outObj = {};
    let regexp = /col-[\w]+-[0-9]+/ig;
    let array = [...classString.matchAll(regexp)];
    for(i in array){
        let string = array[i][0];
        string = string.replace('col-','');
        const index = string.indexOf('-');
        const col = string.substring(0,index);
        const value = parseInt(string.substring(index + 1));
        outObj[col] = value;
    }
    return outObj;
}

function printColumns(element){
    const classString = element.className;
    let array = [...classString.matchAll(findColExp)];
    let outString = "";
    for(i in array){
        outString += array[i] + ' ';
    }
    return outString;
}

function storePreviousColumns(element){
    element.setAttribute('previous-cols',printColumns(element));
}


// Accept an array of sizes and add it to the given element.
// Checks for columns exceeding 12 should be unnecessary, but consider implementation if requested
function addSizesToElement(element, sizes){
    var classString = element.className;
    var currentSizes = getElementSizes(element);
    classString = stripColumns(classString);
    for(i in sizes){
        currentSizes[i] += sizes[i];
        classString += (' col-' + i + '-' + currentSizes[i]);
    }
    element.className = classString;
}


// Accept an array of sizes and subtract it from a given element
function subtractSizesFromElement(element, sizes){
    var classString = element.className;
    var currentSizes = getElementSizes(element);
    classString = stripColumns(classString);
    for(i in sizes){
        currentSizes[i] -= sizes[i];
        classString += (' col-' + i + '-' + currentSizes[i]); 
    }
    element.className = classString; 
}

// Increase an element by the entire column width of another and hide the absorbed element
function absorbElement(elementGrow, elementShrink){
    var addSizes = getElementSizes(elementShrink);
    addSizesToElement(elementGrow, addSizes);
    storePreviousColumns(elementShrink);
    elementShrink.className = stripColumns(elementShrink.className);
    $(elementShrink).addClass('hidden');
}

function unabsorbElement(elementShrink,elementGrow){
    const previousCols = $(elementGrow).attr('previous-cols');
    
    $(elementGrow).attr('previous-cols','');
    $(elementGrow).addClass(previousCols);
    
    const subSizes = getElementSizes(elementGrow);
    subtractSizesFromElement(elementShrink,subSizes);
    
    $(elementGrow).removeClass('hidden');
}

// Reduce an element by a specified amount and add it to another
function splitElement(elementGrow, elementShrink, amount){
    var subtractArray = makeSizeArray(amount);
    subtractSizesFromElement(elementShrink, subtractArray);
    addSizesToElement(elementGrow,subtractArray);
}

// Make a standard array of sizes
function makeSizeArray(value){
    return {sm: value,xs: value, md: value,lg: value,xl: value};
}

// Strip bootstrap columns to make introduction of new sizes easier
function stripColumns(className){
    // Get class if element is handed
    if(typeof className != 'string')
        className = className.className;
    
    if(typeof className == 'string')
        return className.replace(/col-[\w]+[-][0-9]+/ig,"");
}
// **** END BOOTSTRAP HELPER FUNCTIONS ****

// Insert a given string into another at a given index.
function insertStringAtIndex(stringGrow,stringAdd, index){
    firstChunk = stringGrow.substring(0,index);
    secondChunk = stringGrow.substring(index);
    return (firstChunk + stringAdd + secondChunk);
}

// Take in a jquery selection string or jquery object and reverse the direct child elements
function flipContainer(containerSelector){
    if(typeof containerSelector == 'string')
        containerSelector = $(containerSelector);

    containerSelector.children().each(function(){
        containerSelector.prepend($(this));
    });
}