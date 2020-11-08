/**
 * Finds the element parent of the sorting items
 * Needed to manipulate DOM
 * @param {*} element 
 */
function findSortingParent(element){
    if(element.hasChildNodes()){    
        
        if(element.getAttribute("href") !== null &&
         (element.getAttribute("href").toUpperCase() === (subName+HOT_URL).toUpperCase()||
         element.getAttribute("href").toUpperCase() === (subName+"HOT").toUpperCase())){
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
                
                console.log("RCS: RAID", previousItem)
                if(!controversialEnabled){
                    console.log("RCS: YEPfhgbdfvdcxs")


                    /**
                     * Handling Reddit's controversial item, which appears two steps above.
                     */
                    var menuGrandParentDiv = element.parentElement.parentElement.childNodes;
                    if((menuGrandParentDiv.length > 2 
                        && menuGrandParentDiv[2].getAttribute("href") !== subName+CONTROVERSIAL_URL) 
                        ){ //Second check is for user page
                            addControversialItem(element);
                    }
                    else{
                        //Handling css to reappear menu items
                        var styleSheet = document.createElement("style");
                        styleSheet.innerText = styles;

                        element.appendChild(styleSheet);
                    }
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