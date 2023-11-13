let currentGameArea = "#home";

let quiz = {
    questions: [],
    questionIndex: 0,
    getQuestion: function() {
        return questions[this.questionIndex];
    },
    nextQuestion: function() {
        return questions[++this.questionIndex];
    }
};

// Equivalent to $(document).ready( handler ) https://api.jquery.com/ready/
$(init);

// Event listeners
$("#start-quiz").on("click", () => {
    swapGameArea("#quiz");
});

$("#next-button").on("click", () => {
    showQuestion(quiz.nextQuestion());
});

/**
 * Initialises variables and elements
 */
function init(){ 
    quiz.questions = questions;
    swapGameArea("#quiz");
}

/**
 * Swaps which screen is displayed eg Home screen -> Quiz screen
*/
function swapGameArea(gameArea){
    $(currentGameArea).attr("data-visible", "false")
    currentGameArea = gameArea;
    $(currentGameArea).attr("data-visible", "true");

    if(gameArea === "#quiz"){
        showQuestion(quiz.getQuestion());
    }
}

function showQuestion(questionSet){
    $("#question-box > h2").html(questionSet.question);
    let answerBoxes = $(".answer-box");
    
    for(let i = 0; i < 3; i++) {
        // Using [element].childNodes [https://www.w3schools.com/jsref/prop_node_childnodes.asp]
        answerBoxes[i].childNodes[1].innerText = questionSet.options[i];
    }
}

function getCurrentGameArea(){
    return currentGameArea;
}

module.exports = {init, getCurrentGameArea, swapGameArea};