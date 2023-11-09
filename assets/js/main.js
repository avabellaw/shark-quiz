$(document).ready(init);

/**
 * Initialises variables and elements
 */
function init(){ 
    $(".game-area").hide(); // Hides all game-areas

    showHomeScreen();
}

function showHomeScreen(){
    $("#home").show();
}

module.exports