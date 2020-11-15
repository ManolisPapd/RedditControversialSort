var counter = 0;
var currentItem = null;
var previousItem = null;
var controversialEnabled = false;
var subName = "";
var fromProfilePage = true;

var menu = {

    visible: `._2pUO1Sfe7WlIHvq6goN3Pz > *,
        .icon.icon-menu,
        ._29FQ-HlVE3aNu0iB8mO-ey.GzkzdrqG-NjAYH7eKJan4 {
            visibility: visible;
        }`,
    invisible: `._2pUO1Sfe7WlIHvq6goN3Pz > *,
    .icon.icon-menu,
    ._29FQ-HlVE3aNu0iB8mO-ey.GzkzdrqG-NjAYH7eKJan4 {
        visibility: hidden;
    }`

  
  };

/**
 * Making the sorting menu bar invisible 
 */
var style = document.documentElement.appendChild(document.createElement('style'));
style.textContent = menu.invisible;


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
        subNameSplit = subName.split("/")
        if(subNameSplit.length > 3){ //Needed to remove from name /hot /best etc.
            subName = subName.slice(0, -1 * (subNameSplit[3].length) - 1);
        }
        findSortingParent(document.body);
    }
    else if(window.location.href.match(user_profile_pattern)){ //For User page, not yet implemented
        console.log("RCS: NOT IMPLEMENTED for profile page -> ", window.location.href);
        var style = document.documentElement.appendChild(document.createElement('style'));
        style.textContent = menu.visible;
        previousItem = null;
        currentItem = mutation.target.baseURI;
        // subName = window.location.href.match(user_profile_pattern)[0] + USER_PAGE_URL;
    }
    else{
        findSortingParent(document.body);
    }
 });

 


