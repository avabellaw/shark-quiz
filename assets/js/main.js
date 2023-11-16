// Game variables
let currentGameArea = "#home";

let quiz = {
    questions: [],
    userAnswers: [],
    questionIndex: 0,
    questionAnswered: false,
    score: 0,
    getQuestion: function () {
        return questions[this.questionIndex];
    },
    hasNextQuestion: function () {
        return this.questionIndex < this.questions.length - 1;
    },
    nextQuestion: function () {
        $(".answer-box.incorrect-answer").removeClass("incorrect-answer");
        $(".answer-box.correct-answer").removeClass("correct-answer");
        $(".answer-box.grey-out").removeClass("grey-out");
        $(".answer-box_desc").attr("data-visible", "false");
        $("#next-button").addClass("grey-out");
        this.questionAnswered = false;
        timer.resetTimer(timerTick);

        return questions[++this.questionIndex];
    },
    answerQuestion: function (answerId) {
        this.userAnswers.push(parseInt(answerId));
        this.questionAnswered = true;
        $("#next-button").removeClass("grey-out");
        return answerId == this.questions[this.questionIndex].answer;
    }
};

let gameAreaOptions = {
    // The options to pass into swapGameArea()
    home: "#home",
    quiz: "#quiz",
    endGame: "#end-game"
};

let topbarMenuOptions = {
    // The options to pass into displayTopBar()
    home: 0,
    quiz: 1,
};

nextButtonTooltip = tippy(document.getElementById("next-button"), {
    // Setup the tooltip for when next button is clicked before answering the question
    content: "Please answer question first",
    placement: "left",
    trigger: "manual",
    animation: "perspective"
});

// Equivalent to $(document).ready( handler ) https://api.jquery.com/ready/
$(init);

/**
 * Initialises variables and elements
 */
function init() {
    quiz.questions = questions.slice(0, 5);

    // Event listeners
    $("#start-quiz").on("click", () => {
        swapGameArea(gameAreaOptions.quiz);
    });

    $("#next-button").on("click", () => {
        clickNextButton();
    });

    document.addEventListener("keyup", (event) => {
        // Add key listener [https://www.section.io/engineering-education/keyboard-events-in-javascript/]
        if (event.key === "Enter") {
            if (currentGameArea === gameAreaOptions.home)
                $("#start-quiz").trigger("click");
            else
                clickNextButton();
        }
    });

    $(".answer-box").on("click", (event) => {
        if (quiz.questionAnswered) return;
        // event.target gets the top element which is the paragraph tag [https://www.metaltoad.com/blog/how-detect-which-element-was-clicked-using-jquery]
        let clickedBox = event.target.parentElement;
        let correctAnswer = quiz.answerQuestion(clickedBox.dataset.option);

        if (!correctAnswer) {
            $(clickedBox).addClass("incorrect-answer");
        } else {
            let score = quiz.score += timer.timer + 10;
            document.getElementById("points").innerText = score;
        }

        timer.stopTimer();

        showCorrectAnswer();
    });

    randomiseAnswerPositions();
}

function clickNextButton() {
    if (!quiz.questionAnswered) {
        nextButtonTooltip.show();
        return;
    };

    if (!quiz.hasNextQuestion()) {
        swapGameArea(gameAreaOptions.endGame);
        return;
    }
    showQuestion(quiz.nextQuestion());
}

/**
 * Will display the top bar based on which option you pass to it
 * @param topbarMenuOptions Takes a topbarMenuOptions option  
 */
function displayTopBar(topbarMenuOption) {
    $.each($(".topbar_icon"), function (i, icon) {
        let id = $(icon).attr("id");
        if (id === "home-button") return;

        if (id === "score") {
            // Display score
            $(icon).attr("data-visible", topbarMenuOption === topbarMenuOptions.quiz);
        } else {
            // Display help and leader board icons
            $(icon).attr("data-visible", topbarMenuOption === topbarMenuOptions.home);
        }
    });
}

/**
 * This is passed as a callback funcion to the timer to update the progress bar
 * @param timeLeft Timer passes the time left on the timer 
 */
function timerTick(timeLeft) {
    $("#timer > div").width(`${timeLeft * (100 / timer.max)}%`);

    if (timeLeft % 2 === 0) {
        // Set progress bar colour - slowly turns red
        let red = 255 - ((255 / timer.max) * timeLeft);
        let green = 117 - 100 + timeLeft * (100 / timer.max);
        let blue = 223 - 180 + (timeLeft * (180 / timer.max));

        $("#timer > div").css("background-color", `rgb(${red}, ${green}, ${blue})`);
    }

    if (timeLeft === 0) {
        // If ran out of time
        setTimeout(() => {
            // -1 indicates that the timer ran out
            quiz.answerQuestion(-1);

            // $("class").each() wasn't working therfore I found a different way [https://stackoverflow.com/questions/4735342/jquery-to-loop-through-elements-with-the-same-class]
            $.each($(".answer-box"), function (i, box) {
                // This will loop through every .answer-box and apply the appropriate class 
                if (i !== quiz.getQuestion().answer)
                    $(box).addClass("incorrect-answer");
            });
            // Show the correct answer after displaying the incorrect ones
            showCorrectAnswer();
        }, 500);
    }
}

function showCorrectAnswer() {
    // Apply .correct-answer to the correct option and .grey-out the rest
    let correctAnswerOptionNum = quiz.getQuestion().answer;
    $.each($(".answer-box"), function (i, option) {
        if (option.dataset.option == correctAnswerOptionNum) {
            $(option).addClass("correct-answer");
            $(option).find(".answer-box_desc").attr("data-visible", "true").text(quiz.getQuestion().description);
        } else {
            $(option).addClass("grey-out");
        }
    });
}

function randomiseAnswerPositions() {
    // Loops through the options and randomize where the correct option is
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

    switch (gameArea) {
        case "#quiz":
            displayTopBar(topbarMenuOptions.quiz);
            showQuestion(quiz.getQuestion());
            break;
        case "#end-game":
            displayTopBar(topbarMenuOptions.home);
            let correctAnswers = quiz.userAnswers.reduce(scoreReducer, 0);

            $("#questions-correct").text(correctAnswers);
            $("#total-questions").text(quiz.questions.length);
            $("#end-game-score").text(quiz.score);
            break;
    }
}

function scoreReducer(acc, currentValue, i) {
    if (currentValue === quiz.questions[i].answer)
        return acc += 1;

    return acc;
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