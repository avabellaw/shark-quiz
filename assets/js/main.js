let currentGameArea = "#home";

// Equivalent to $(document).ready( handler ) https://api.jquery.com/ready/
$(init);

// Event listeners
$("#start-quiz").on("click", () => {
    console.log(swapGameArea("#quiz"));
});

/**
 * Initialises variables and elements
 */
function init(){ 
    swapGameArea("#quiz");
}

function swapGameArea(gameArea){
    $(currentGameArea).attr("data-visible", "false")
    currentGameArea = gameArea;
    $(currentGameArea).attr("data-visible", "true");
}

function getCurrentGameArea(){
    return currentGameArea;
}

module.exports = {init, getCurrentGameArea, swapGameArea};