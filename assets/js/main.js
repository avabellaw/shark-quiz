let currentGameArea = "#home";

// Equivalent to $(document).ready( handler ) https://api.jquery.com/ready/
$(init);

$("#start-quiz").on("click", () => {
    console.log(swapGameArea("#quiz"));
});

/**
 * Initialises variables and elements
 */
function init(){ 
}

function swapGameArea(gameArea){
    $(currentGameArea).attr("data-visible", "false")
    currentGameArea = gameArea;
    $(currentGameArea).attr("data-visible", "true");

    return currentGameArea;
}

module.exports = {init, currentGameArea, swapGameArea};