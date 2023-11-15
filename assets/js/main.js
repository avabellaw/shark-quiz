// Game variables
let currentGameArea = "#home";

let quiz = {
    questions: [],
    userAnswers: [],
    questionIndex: 0,
    questionAnswered: false,
    getQuestion: function () {
        return questions[this.questionIndex];
    },
    hasNextQuestion: function () {
        return this.questionIndex < this.questions.length - 1;
    },
    nextQuestion: function () {
        $(".answer-box.incorrect-answer").removeClass("incorrect-answer");
        $(".answer-box.correct-answer").removeClass("correct-answer");
        this.questionAnswered = false;
        timer.resetTimer(timerTick);
        
        return questions[++this.questionIndex];
    },
    answerQuestion: function (answerId) {
        this.userAnswers.push(answerId);
        this.questionAnswered = true;
        return answerId == this.questions[this.questionIndex].answer;
    }
};

// Equivalent to $(document).ready( handler ) https://api.jquery.com/ready/
$(init);

/**
 * Initialises variables and elements
 */
function init() {
    quiz.questions = questions;

    // Event listeners
    $("#start-quiz").on("click", () => {
        swapGameArea("#quiz");
    });

    $("#next-button").on("click", () => {
        if (!quiz.questionAnswered) return;
        showQuestion(quiz.nextQuestion());
    });

    $(".answer-box").on("click", (event) => {
        if (quiz.questionAnswered) return;
        // event.target gets the top element which is the paragraph tag [https://www.metaltoad.com/blog/how-detect-which-element-was-clicked-using-jquery]
        let clickedBox = event.target.parentElement;
        let correctAnswer = quiz.answerQuestion(clickedBox.dataset.option);

        if (!correctAnswer) {
            $(clickedBox).addClass("incorrect-answer");
        }

        timer.stopTimer();

        showCorrectAnswer();
    });

    randomiseAnswerPositions();
}

function timerTick(timeLeft) {
    $("#timer > div").width(`${timeLeft * (100 / timer.max)}%`);

    if (timeLeft % 3 === 0){
        // Set progress bar colour
        let red = 255 - ((255 / timer.max) * timeLeft);
        let green = 117 - 100 + timeLeft * (100 / timer.max);
        let blue = 223 - 180 + (timeLeft * (180 / timer.max));

        $("#timer > div").css("background-color", `rgb(${red}, ${green}, ${blue})`);
    }

    if (timeLeft === 0) {
        setTimeout(() => {
            quiz.answerQuestion(-1);

            // .each() wasn't working therfore I found a different way [https://stackoverflow.com/questions/4735342/jquery-to-loop-through-elements-with-the-same-class]
            $.each($(".answer-box"), function (i, box) {
                // This will loop through every .answer-box and apply the appropriate class 
                if (i === quiz.getQuestion().answer)
                    $(box).addClass("correct-answer");
                else
                    $(box).addClass("incorrect-answer");
            });
        }, 500);
    }
}

function showCorrectAnswer() {
    let correctAnswerOptionNum = quiz.getQuestion().answer;
    $(`.answer-box[data-option="${correctAnswerOptionNum}"]`).addClass("correct-answer");
}

function randomiseAnswerPositions() {
    for (let question of quiz.questions) {
        let offSet = Math.floor(Math.random() * question.options.length);
        question.answer = offSet;

        for (let i = 0; i < offSet; i++) {
            // Cycles the array [i] number of times by pushing the popped value to the start of the array.
            // unshift adds element to the beginning of the array, push adds to the end [https://www.w3schools.com/jsref/jsref_unshift.asp]
            question.options.unshift(question.options.pop());
        }
    }
}

/**
 * Swaps which screen is displayed eg Home screen -> Quiz screen
*/
function swapGameArea(gameArea) {
    $(currentGameArea).attr("data-visible", "false")
    currentGameArea = gameArea;
    $(currentGameArea).attr("data-visible", "true");

    if (gameArea === "#quiz") {
        showQuestion(quiz.getQuestion());
    }
}

function showQuestion(questionSet) {
    $("#question-box > h2").html(questionSet.question);
    let answerBoxes = $(".answer-box");

    for (let i = 0; i < questionSet.options.length; i++) {
        // Using [element].childNodes [https://www.w3schools.com/jsref/prop_node_childnodes.asp]
        answerBoxes[i].childNodes[1].innerText = questionSet.options[i];
    }

    if (questionSet.options.length < 3) {
        answerBoxes[2].setAttribute("data-visible", "false");
    } else {
        answerBoxes[2].setAttribute("data-visible", "true");
    }
    timer.startTimer(timerTick);
}

function getCurrentGameArea() {
    return currentGameArea;
}

module.exports = { init, quiz, getCurrentGameArea, swapGameArea };