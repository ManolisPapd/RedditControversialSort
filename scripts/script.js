const CONTROVERSIAL_TITLE = "Controversial";
const CONTROVERSIAL_URL = "/controversial/";
const HOT_URL = "/hot/";


var counter = 0;

findSortingParent(document.body)

function findSortingParent(element){
    if(element.hasChildNodes()){
        if(element.getAttribute("href") === HOT_URL){
            if(counter === 1){
                //Checking if Controversial option is activated in order to deactivate it
                //Reddit's controversial button exists two steps above.
                var menuParentDiv = element.parentElement.parentElement.childNodes;
                if(menuParentDiv[2].getAttribute("href") != CONTROVERSIAL_URL){
                    addControversialItem(element);
                }
            }
            else{
                counter++;
            }
            
        }
        else{
            element.childNodes.forEach(findSortingParent);
        }
        
        
    }
    
}

/* 
    Adds the controversial item on the menu
    @param element  
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

    element.parentElement.appendChild(controversialItem)
}