/**
 * Observes DOM changes. Needed because Reddit is one page application and doesn't refresh.
 */
function domObserver(){
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    var observer = new MutationObserver(function(mutations, observer) {
        if(!window.location.href.match(user_profile_pattern)){
            
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
                        findSortingParent(document.body);
                        
                    }
                    
                }

                /**
                 * Handling navigation to home page.
                 */
                if(mutation.target.baseURI === REDDIT_BASE_URL+"/"){
                    if(currentItem !== null && currentItem !== mutation.target.baseURI ){ //currentItem won't be null when tab is active
                        counter = 0;
                        currentItem = mutation.target.baseURI;
                        findSortingParent(document.body);
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
                    // if(mutation.target.baseURI.match(pattern) || 
                    // mutation.target.baseURI.match(user_profile_pattern)){

                    if(mutation.target.baseURI.match(pattern)){

                        if(currentItem !== mutation.target.baseURI ){ 

                            counter = 0;
                            console.log("RCS: ENEMY", previousItem)
                            if(previousItem !== REDDIT_BASE_URL){ //Bug caused from navigating to user profile
                                previousItem = null;
                                controversialEnabled = false;
                            }

                            currentItem = mutation.target.baseURI;
                            if(window.location.href.match(pattern) !== null){
                                subName = window.location.href.match(pattern)[0];
                                subName = subName.slice(0, -1);
                            }
                            // else if(window.location.href.match(user_profile_pattern) !== null){
                            //     subName = window.location.href.match(user_profile_pattern)[0] + USER_PAGE_URL;
                            // }
                            
                        
                            /**
                             * window.location.href will have at some point /hot/ etc so slicing that part is needed
                             * After the above slice, it will be f.e. "/r/SUB/hot"
                             * Will check if /r/SUB/hot = subName+HOT_URL (by complete luck items have the same length)
                             */
                            slicedSubName = subName.slice(0, -4);
                            if((subName + "/") === slicedSubName + HOT_URL){
                                subName = slicedSubName;
                            }

                            findSortingParent(document.body);
                        }
                        
                    } 
                    else{ 
                        if(previousItem !== currentItem || currentItem === REDDIT_BASE_URL + "/"){ //It is needed to capture navigation between pages
                            if(currentItem === REDDIT_BASE_URL + "/"){ //Bug caused from profile page
                                controversialEnabled = false;
                            }

                            counter = 0;
                            previousItem = currentItem;
                            currentItem = mutation.target.baseURI;
                            subName = ""; //We are on homepage again
                            fromProfilePage = true;
                            console.log("RCS: BASE", previousItem)

                            findSortingParent(document.body);

                        }

                    }

                    
                }
                
            }
        }
        else if(fromProfilePage){
            
            var style = document.documentElement.appendChild(document.createElement('style'));
            style.textContent = `._2PAz5_NMDCV5XtywB9mVpg,
            .icon.icon-menu,
            ._29FQ-HlVE3aNu0iB8mO-ey.GzkzdrqG-NjAYH7eKJan4  {
                visibility: visible;
            }`;
            fromProfilePage = false;
            currentItem = PROFILE;
            
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