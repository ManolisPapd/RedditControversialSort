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