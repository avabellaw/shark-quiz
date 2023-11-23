// Game variables
let currentGameArea = "#home";
let prevGameArea;

let quiz = {
    questions: [],
    questionAnswered: false,
    questionIndex: 0,
    userAnswers: [],
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

let gameAreaScreen = {
    // The options to pass into swapGameArea() for example
    home: "#home",
    quiz: "#quiz",
    endGame: "#end-game",
    instructions: "#instructions",
    leaderboard: "#leaderboard",
    submitScore: "#submit-score"
};

let nextButtonTooltip = tippy(document.getElementById("next-button"), {
    // Setup tooltip for if next button is clicked before answering question
    animation: "perspective",
    content: "Please answer question first",
    placement: "left",
    trigger: "manual"
});

let validationTooltip = tippy(document.getElementById("username"), {
    // Setup tooltip for if submit button is without validation passing
    animation: "perspective",
    content: "Validation errors present",
    placement: "top",
    trigger: "manual"
});

// Equivalent to $(document).ready( handler ) https://api.jquery.com/ready/
$(init);

/**
 * Initialises variables and elements
 */
function init() {
    quiz.questions = questions;

    // Randomise the questions order
    for (let i = 0; i < questions.length; i++) {
        // Inspired by [https://dev.to/codebubb/how-to-shuffle-an-array-in-javascript-2ikj]
        let randomIndex = Math.floor(Math.random() * questions.length);
        let valueToSwap = quiz.questions[i];
        quiz.questions[i] = quiz.questions[randomIndex];
        quiz.questions[randomIndex] = valueToSwap;
    }

    quiz.questions.splice(0, 10); // Reduce number of questions by 10

    addEventListeners();

    randomiseAnswerPositions();
}

function addEventListeners() {
    $("#start-quiz").on("click", () => {
        swapGameArea(gameAreaScreen.quiz);
    });

    $("#next-button").on("click", () => {
        clickNextButton();
    });

    $("#instructions-button").on("click", () => {
        if (currentGameArea === gameAreaScreen.instructions)
            swapGameArea(prevGameArea);
        else
            swapGameArea(gameAreaScreen.instructions);
    });

    $("#leaderboard-button").on("click", () => {
        if (currentGameArea === gameAreaScreen.leaderboard)
            swapGameArea(prevGameArea);
        else
            swapGameArea(gameAreaScreen.leaderboard);
    });

    $("#add-to-leaderboard").on("click", () => {
        swapGameArea(gameAreaScreen.submitScore);
        $("#submit-score_score").text(quiz.score);
    });

    $("#submit-score_button").on("click", () => {
        submitScoreToLeaderboard();
    });

    $("#username").on("input", () => {
        validateUsername();
    });

    document.addEventListener("keyup", (event) => {
        // Add key listener [https://www.section.io/engineering-education/keyboard-events-in-javascript/]
        if (event.key === "Enter") {
            switch (currentGameArea) {
                case gameAreaScreen.home:
                    $("#start-quiz").trigger("click");
                    break;
                case gameAreaScreen.quiz:
                    clickNextButton();
                    break;
                case gameAreaScreen.submitScore:
                    submitScoreToLeaderboard();
                    break;
            }
        }
    });

    $(".answer-box").on("click", (event) => {
        if (quiz.questionAnswered) return;
        // event.target gets the top element which is the paragraph tag [https://www.metaltoad.com/blog/how-detect-which-element-was-clicked-using-jquery]
        // event.currentTarget gets the element clicked [https://stackoverflow.com/questions/50149925/click-event-target-gives-element-or-its-child-not-parent-element]
        let clickedBox = event.currentTarget;
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
}

function validateUsername() {
    // specialChars.test() taken from [https://onecompiler.com/questions/3xnp9df38/-javascript-how-to-check-for-special-characters-present-in-a-string]
    let specialChars = /[`!@#$%\^&*()\-+=\[\]{};':"\\|, .<>\/?~]/;

    let passedValidation = true;

    $(".validation-message").removeClass("validation-error");

    if (specialChars.test($("#username").val())) {
        $("#special-characters").addClass("validation-error");
        passedValidation = false;
    }

    let usernameLength = $("#username").val().length;
    if (usernameLength < 2 || usernameLength > 15) {
        $("#min-max-characters").addClass("validation-error");
        passedValidation = false;
    }

    if (!passedValidation) {
        $("#username").addClass("validation-error");
        $("#submit-score_button").addClass("grey-out");
    } else {
        $("#username").removeClass("validation-error");
        $("#submit-score_button").removeClass("grey-out");
    }

    return passedValidation;
}

function submitScoreToLeaderboard() {
    if (validateUsername()) {
        document.cookie = `${$("#username").val()}=${quiz.score}; max-age=31536000;`;
        swapGameArea(gameAreaScreen.leaderboard);
    } else {
        validationTooltip.show();
    }
}

function clickNextButton() {
    if (!quiz.questionAnswered) {
        /*
            process is defined by Jest [https://github.com/atomiks/tippyjs-react/issues/252]
            Stops code from running in Jest as the .show() function isn't available
        */
        if (typeof process === "undefined")
            nextButtonTooltip.show();
        return;
    }

    if (!quiz.hasNextQuestion()) {
        swapGameArea(gameAreaScreen.endGame);
        return;
    }
    showQuestion(quiz.nextQuestion());
}

/**
 * Will display the top bar based on which option you pass to it
 * @param gameAreaScreen Takes a gameAreaScreen variable
 */
function displayTopBar(gameArea) {
    $.each($(".topbar_icon"), function (i, icon) {
        let id = $(icon).attr("id");
        switch (id) {
            case "home-button":
                return;
            case "score":
                // Display score icon
                $(icon).attr("data-visible", gameArea === gameAreaScreen.quiz);
                break;
            case "instructions-button":
            case "leaderboard-button":
                // Display instructions and leaderboard button
                $(icon).attr("data-visible", gameArea === gameAreaScreen.home ||
                             gameArea === gameAreaScreen.instructions);
                break;
        }
    });
}

/**
 * Used as a callback funcion, called by the timer, and updates the progress bar when called
 * @param timeLeft The time left on the Timer is passed through as this argument
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

/**
 * Applies .correct-answer to the correct option and .grey-out to the rest.
 * Makes the correct answer's description appear.
 */
function showCorrectAnswer() {
    let correctAnswerOptionNum = quiz.getQuestion().answer;
    $.each($(".answer-box"), function (i, option) {
        if (option.dataset.option == correctAnswerOptionNum) {
            $(option).addClass("correct-answer");
            let desc = quiz.getQuestion().description;
            $(option).find(".answer-box_desc").attr("data-visible", "true").text(desc);
        } else {
            $(option).addClass("grey-out");
        }
    });
}

/**
 * Loops through the options and randomize where the correct option is
 */
function randomiseAnswerPositions() {
    for (let question of quiz.questions) {
        let offSet = Math.floor(Math.random() * question.options.length);
        question.answer = offSet;

        for (let i = 0; i < offSet; i++) {
            // Cycles the array [i] number of times by pushing the popped value to the start of the array.
            // unshift() adds element to the beginning of the array, push() adds to the end [https://www.w3schools.com/jsref/jsref_unshift.asp]
            question.options.unshift(question.options.pop());
        }
    }
}

/**
 * Swaps which screen is displayed eg Home screen -> Quiz screen
 * @param gameArea Takes a gameAreaScreen variable
*/
function swapGameArea(gameArea) {
    prevGameArea = currentGameArea;
    currentGameArea = gameArea;

    $(prevGameArea).attr("data-visible", "false");
    $(currentGameArea).attr("data-visible", "true");

    if (currentGameArea == gameAreaScreen.leaderboard || currentGameArea == gameAreaScreen.instructions)
        prevGameArea = gameAreaScreen.home;

    switch (gameArea) {
        case gameAreaScreen.quiz:
            displayTopBar(gameAreaScreen.quiz);
            showQuestion(quiz.getQuestion());
            // Displays confimation dialog before leaving quiz [https://www.sanwebe.com/2013/02/confirmation-dialog-on-leaving-page-javascript]
            window.onbeforeunload = (e) => {
                // You can't display your own text anymore due to security risks.
                return "";
            };
            break;
        case gameAreaScreen.endGame:
            displayTopBar(gameAreaScreen.endGame);
            if (prevGameArea !== gameAreaScreen.quiz) break;
            let correctAnswers = quiz.userAnswers.reduce(scoreReducer, 0);

            $("#questions-correct").text(correctAnswers);
            $("#total-questions").text(quiz.questions.length);
            $("#end-game-score").text(quiz.score);
            break;
        case gameAreaScreen.instructions:
            displayTopBar(gameAreaScreen.instructions);
            break;
        case gameAreaScreen.leaderboard:
            window.onbeforeunload = (e) => {
                // Remove "You have unsaved changes" dialog
            };
            let userScores = [];
            for (let cookie of document.cookie.split(";")) {
                if (cookie === "") break;
                let userScorePair = cookie.split("=");

                userScores.push({ username: userScorePair[0], score: userScorePair[1] });
            }

            // Sort userScores [https://www.altcademy.com/blog/how-to-sort-array-of-objects-in-javascript/]
            userScores.sort((a, b) => b.score - a.score);

            addScoresToLeaderboard(userScores);
            break;
    }
}

/**
 * Adds the user scores to the leaderboard.
 * @param userScores An array of objects containing each username and score to be displayed.
 */
function addScoresToLeaderboard(userScores) {
    let alreadyDisplayedScores = $("#leaderboard_table tbody").children();

    if (alreadyDisplayedScores.length > 1) {
        for (let i = 1; i < alreadyDisplayedScores.length; i++) {
            $(alreadyDisplayedScores)[i].remove();
        }
    }

    for (let i = 0; i < 10; i++) {
        let username = i < userScores.length ? userScores[i].username : "";
        let score = i < userScores.length ? userScores[i].score : "";

        $("#leaderboard_table tbody").append(`<tr>
                    <td>
                    ${i + 1}
                    </td>
                    <td>
                    ${username}
                    </td>
                    <td>
                    ${score}
                    </td>
                </tr>`);
    }
}

/**
 * Function to to determine number of correct answers
 * Used as function for .reduce() on userAnswers array
 * @returns Number of correct answers.
 */
function scoreReducer(acc, currentValue, i) {
    if (currentValue === quiz.questions[i].answer)
        return acc += 1;

    return acc;
}

/**
 * Display question and answer options.
 * @param questionSet The question from quiz.questions
 */
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

/*
    Exports the functions for Jest to import and test.
    The if statement prevents an error being logged to the console in the browser.
    I got it from a stackoverflow post [https://stackoverflow.com/questions/52506163/unit-testing-with-jest-without-module-exports]
*/
if (typeof exports !== "undefined")
    module.exports = { init, quiz, getCurrentGameArea, swapGameArea };