var counter = 0;
var currentItem = null;
var previousItem = null;
var controversialEnabled = false;
const pattern = /[\/]r[\/].*/i;
var subName = "";

/**
 * Making the sorting menu bar invisible 
 */
var style = document.documentElement.appendChild(document.createElement('style'));
style.textContent = `._2PAz5_NMDCV5XtywB9mVpg,
.icon.icon-menu {
    visibility: hidden;
}`;


//Controversial item will be added after DOM is loaded
addEventListener("load", function(){ 
    domObserver();
    console.log("RCS: DOM is loaded");
    /**
     * Reassigning values because the current listner is activated multiple times throughout the lifetime of the item.
     */
    counter = 0;
    currentItem = null;
    controversialEnabled = false;
    //Don't create the item if the first page is a subreddit
    if(window.location.href.match(pattern)){
        console.log("RCS: Controversial Item For Subreddit -> ", window.location.href);
        subName = window.location.href.match(pattern)[0];
        subName = subName.slice(0, -1);
        
    }
    findSortingParent(document.body);
 });

 


