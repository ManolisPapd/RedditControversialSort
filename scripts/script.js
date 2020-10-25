const CONTROVERSIAL_TITLE = "Controversial";
const CONTROVERSIAL_URL = "/controversial/";
const HOT_URL = "/hot/";
const BEST_URL = "/best/";
const TOP_URL = "/top/";
const NEW_URL = "/new/";
const REDDIT_BASE_URL =  "https://www.reddit.com";


domObserver();

var counter = 0;
var currentItem = "";
var controversialEnabled = false;

findHomePageSortingParent(document.body);


function findHomePageSortingParent(element){
    if(element.hasChildNodes()){
        if(element.getAttribute("href") === HOT_URL){
            if(counter === 1){
                /*  Handling when controversial options activated
                    Checking if controversial option is activated in order to deactivate it.
                    Two cases when controversial item present:
                     - Reddit's controversial button exists two steps above the menu items.
                     - Switching between items
                */

                
                /**
                 * Handling controversial when switching between items
                 */
                var menuParentDiv = element.parentElement.childNodes;
                for(let menuItem of menuParentDiv){
                    if(menuItem.getAttribute("href") === CONTROVERSIAL_URL){
                        console.log("Mutation: EINAI MESA");
                        controversialEnabled = true;

                    }
                }
                if(!controversialEnabled){
                    /**
                     * Handling Reddit's controversial item, which appears two steps above.
                     */
                    var menuGrandParentDiv = element.parentElement.parentElement.childNodes;
                    if(menuGrandParentDiv[2].getAttribute("href") !== CONTROVERSIAL_URL){
                        addControversialItem(element);
                    }
                }

            }
            else{
                counter++;
            }
            
        }
        else{
            element.childNodes.forEach(findHomePageSortingParent);
        }
        
    }
    
}

/**
 * Adds the controversial item on the menu
 * @param {*} element 
 */
function addControversialItem(element){    
    /* Hyperlink properties */
    var controversialItem = document.createElement("a");
    controversialItem.className = element.getAttribute("class");
    controversialItem.href = CONTROVERSIAL_URL;

    /* svg class  */

    //Retrieving svg class attribute from the existed ones since it's the same for every item
    var children = element.childNodes;

    //First element is the svg class
    var currentSvgElement = children[0];
    var svg = "<svg class=\"" + currentSvgElement.getAttribute("class") +"\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><g><polygon fill=\"inherit\" points=\"16 0 7.25 0 3.5 10.108 8.5 10.108 4.475 20 16 8 11 8\"></polygon></g></svg>";
    controversialItem.insertAdjacentHTML('beforeend', svg);
    
    /* Text styling from existing items */
    var currentDivElement = children[1];
    var divControversialClass = document.createElement("div");
    divControversialClass.textContent = CONTROVERSIAL_TITLE;
    divControversialClass.className = currentDivElement.getAttribute("class");
    controversialItem.appendChild(divControversialClass);

    element.parentElement.appendChild(controversialItem);
}



/**
 * Observes DOM changes. Needed because Reddit is one page application and doesn't refresh.
 */
function domObserver(){
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    var observer = new MutationObserver(function(mutations, observer) {
        for(let mutation of mutations){
            if(mutation.target.baseURI === REDDIT_BASE_URL+HOT_URL || 
            mutation.target.baseURI === REDDIT_BASE_URL+BEST_URL || 
            mutation.target.baseURI === REDDIT_BASE_URL+NEW_URL ||
            mutation.target.baseURI === REDDIT_BASE_URL+TOP_URL ){

                /**
                 * There are multiple mutations with the same baseURI and loading the item multiple times isn't efficient
                **/
                if(currentItem !== mutation.target.baseURI){
                    currentItem = mutation.target.baseURI;
                    console.log("Mutation: ", currentItem);
                    counter = 0;
                    findHomePageSortingParent(document.body);
                    
                }
                
            }
        }
        
    });

    observer.observe(document, {
        subtree: true,
        attributes: true,
        attributeOldValue: true,
        childList: true,
        characterData: true, 
        attributeFilter: ['data-thing']
    });
}