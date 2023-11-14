let currentGameArea = "#home";

let quiz = {
    questions: [],
    userAnswers: [],
    questionIndex: 0,
    questionAnswered: false,
    getQuestion: function() {
        return questions[this.questionIndex];
    },
    nextQuestion: function() {
        return questions[++this.questionIndex];
    },
    answerQuestion: function(answerId) {
        this.userAnswers.push(answerId);
        this.questionAnswered = true;
        return answerId == this.questions[this.questionIndex].answer;
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

$(".answer-box").on("click", (event) => {
    if(quiz.questionAnswered) return;
    // event.target gets the top element which is the paragraph tag [https://www.metaltoad.com/blog/how-detect-which-element-was-clicked-using-jquery]
    let clickedBox = event.target.parentElement;
    let correctAnswer = quiz.answerQuestion(clickedBox.dataset.option);

    if(!correctAnswer){
        $(clickedBox).addClass("incorrect-answer");
    }

    let correctAnswerOptionNum = quiz.getQuestion().answer;
    console.log(correctAnswerOptionNum);
    $(`.answer-box[data-option="${correctAnswerOptionNum}"]`).addClass("correct-answer");
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
    
    for(let i = 0; i < questionSet.options.length; i++) {
        // Using [element].childNodes [https://www.w3schools.com/jsref/prop_node_childnodes.asp]
        answerBoxes[i].childNodes[1].innerText = questionSet.options[i];
    }

    if(questionSet.options.length < 3) {
        answerBoxes[2].setAttribute("data-visible", "false");
    } else {
        answerBoxes[2].setAttribute("data-visible", "true");
    }
}

function getCurrentGameArea(){
    return currentGameArea;
}

module.exports = {init, getCurrentGameArea, swapGameArea};