$(document).ready(function(){
    init();
    showHomeScreen();
});

/**
 * Initialises variables and elements
 */
function init(){ 
    $(".game-area").hide(); // Hides all game-areas
}

function showHomeScreen(){
    $("#home").show();
}

module.exports = {init, showHomeScreen};