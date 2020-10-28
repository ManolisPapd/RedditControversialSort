const CONTROVERSIAL_TITLE = "Controversial";
const CONTROVERSIAL_URL = "/controversial/";
const HOT_URL = "/hot/";
const BEST_URL = "/best/";
const TOP_URL = "/top/";
const NEW_URL = "/new/";
const REDDIT_BASE_URL =  "https://www.reddit.com";


domObserver();

var counter = 0;
var currentItem = null;
var previousItem = null;
var controversialEnabled = false;
var pattern = /[\/]r[\/].*/i;
var subName = "";

//Controversial item will be added after DOM is loaded
addEventListener("load", function(){ 
    console.log("RCS: DOM is loaded");
    counter = 0;
    currentItem = null;
    controversialEnabled = false;
    //Don't create the item if the first page is a subreddit
    if(!window.location.href.match(pattern)){
        findSubredditSortingParent(document.body);
    }
    else{
        console.log("RCS: Controversial Item For Subreddit -> ", window.location.href);
        subName = window.location.href.match(pattern)[0];
        subName = subName.slice(0, -1);
        findSubredditSortingParent(document.body)
    }
    
 });


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

function findSubredditSortingParent(element){
    //TODO transform it 
    if(element.hasChildNodes()){     
        
        if(element.getAttribute("href") === subName+HOT_URL){
            
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
                    if(menuItem.getAttribute("href") === subName+CONTROVERSIAL_URL){
                        controversialEnabled = true;
                    }
                }
                if(!controversialEnabled){
                    /**
                     * Handling Reddit's controversial item, which appears two steps above.
                     */
                    var menuGrandParentDiv = element.parentElement.parentElement.childNodes;
                    if(menuGrandParentDiv[2].getAttribute("href") !== subName+CONTROVERSIAL_URL){
                        addControversialItem(element);
                    }
                }

            }
            else{
                counter++;
            }
            
        }
        else{
            element.childNodes.forEach(findSubredditSortingParent);
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
    controversialItem.className = element.getAttribute("class").split(" ")[0]; //Split because the second part of class makes it appear selected
    controversialItem.href = subName+CONTROVERSIAL_URL;

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
                    previousItem = currentItem;
                    currentItem = mutation.target.baseURI;
                    counter = 0;
                    findSubredditSortingParent(document.body);
                    
                }
                
            }

            /**
             * Handling navigation to home page.
             */
            if(mutation.target.baseURI === REDDIT_BASE_URL+"/"){
                if(currentItem !== null && currentItem !== mutation.target.baseURI ){ //currentItem won't be null when tab is active
                    counter = 0;
                    currentItem = mutation.target.baseURI;
                    findSubredditSortingParent(document.body);
                }
            }

            /**
             * Handling subreddits
             * When user visits from homepage, only mutation seems to be triggered.
             * This is causing issue because DOM hasn't finished yet.
             * The first mutation is a style.
             * The last mutation seems to be title.
             */
            if(mutation.target.localName === "title"){
                if(mutation.target.baseURI.match(pattern)){
                    
                    if(currentItem !== mutation.target.baseURI ){ 
                        counter = 0;
                        previousItem = currentItem;
                        currentItem = mutation.target.baseURI;
                        subName = window.location.href.match(pattern)[0];
                        subName = subName.slice(0, -1);
                        /**
                         * window.location.href will have at some point /hot/ etc so slicing that part is needed
                         * After the above slice, it will be f.e. "/r/SUB/hot"
                         * Will check if /r/SUB/hot = subName+HOT_URL (by complete luck items have the same length)
                         */
                        slicedSubName = subName.slice(0, -4);
                        if((subName + "/") === slicedSubName + HOT_URL){
                            subName = slicedSubName;
                        }
                        findSubredditSortingParent(document.body);
                    }
                    
                }
                else{ 
                    if(previousItem !== currentItem){ //It is needed to capture navigation between pages
                        counter = 0;
                        previousItem = currentItem;
                        currentItem = mutation.target.baseURI;
                        subName = ""; //We are on homepage again
                        findSubredditSortingParent(document.body);
                    }
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