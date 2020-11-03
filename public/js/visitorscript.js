//code for checking unique username and email.
// also for verifying deatils.
$(function(){

    var socket = io('/visitor');
    //console.log(getParentUrl());
  
  });//end of function.
  

  function getParentUrl() {
    var isInIframe = (parent !== window),
        parentUrl = null;

    if (isInIframe) {
        parentUrl = document.referrer;
    }

    return parentUrl;
}