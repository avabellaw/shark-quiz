let currentGameArea = "#home";

// Equivalent to $(document).ready( handler ) https://api.jquery.com/ready/
$(function(){
    init();
    // showHomeScreen();
    swapGameArea("#quiz");
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

function swapGameArea(gameArea){
    $(currentGameArea).hide();
    currentGameArea = gameArea;
    console.log(currentGameArea);
    $(currentGameArea).show();

    return currentGameArea;
}

module.exports = {init, showHomeScreen, currentGameArea, swapGameArea};