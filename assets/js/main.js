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
    console.log(swapGameArea("#quiz"));
});

/**
 * Initialises variables and elements
 */
function init(){ 
    swapGameArea("#quiz");
    quiz.questions = questions;
}

/**
 * Swaps which screen is displayed eg Home screen -> Quiz screen
*/
function swapGameArea(gameArea){
    $(currentGameArea).attr("data-visible", "false")
    currentGameArea = gameArea;
    $(currentGameArea).attr("data-visible", "true");

    if(gameArea === "#quiz"){
        showQuestions();
    }
}

function showQuestions(){
    let questionSet = quiz.getQuestion();
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