/**
 * @jest-environment jsdom
*/

const { init, quiz, getCurrentGameArea, swapGameArea, showQuestion } = require("../main");

beforeAll(() => {
    let fs = require("fs");
    let fileContents = fs.readFileSync("index.html", "utf-8");
    document.open();
    document.write(fileContents);
    document.close();
});

describe(".game-area transitions work correctly", () => {
    test("Initially, currentGameArea should be #home", () => {
        expect(getCurrentGameArea()).toBe("#home");
    });
    test("Questions array shouldn't be empty", () => {
        expect(questions.length > 0).toBeTruthy();
        init();
        expect(quiz.questions.length > 0).toBeTruthy();
    });
    test("swapGameArea should swap from #home to #quiz", () => {
        expect(getCurrentGameArea()).toBe("#home");
        swapGameArea("#quiz");
        expect(getCurrentGameArea()).toBe("#quiz");
        expect(document.getElementById("quiz").dataset.visible).toEqual("true");
        expect(document.getElementById("home").dataset.visible).toEqual("false");
    });
});

describe("Quiz updates correctly between questions", () => {
    beforeEach(() => {
        // Reset the variables and elements after each test
        $(".answer-box").removeClass("correct-answer").removeClass("incorrect-answer");
        quiz.questionIndex = 0;
        quiz.userAnswers = [];
        quiz.questionAnswered = false;
        swapGameArea("#quiz");
    });

    test("Correct answer box should have the class 'correct-answer'", () => {
        let correctAnswer = quiz.getQuestion().answer;

        expect($(`.answer-box[data-option="${correctAnswer}"]`).hasClass("correct-answer")).toBeFalsy();

        $(`.answer-box[data-option="${correctAnswer}"]`).trigger("click");

        expect($(`.answer-box[data-option="${correctAnswer}"]`).hasClass("correct-answer")).toBeTruthy();
        expect($(".answer-box").hasClass("incorrect-answer")).toBeFalsy();
    });

    test("If answered wrong, .incorrect-answer and .correct-answer should be applied", () => {
        while (quiz.hasNextQuestion()) {
            let correctAnswerIndex = quiz.getQuestion().answer;
            let incorrectAnswer;
            expect($(".answer-box").hasClass("incorrect-answer")).toBeFalsy();
            expect($(".answer-box").hasClass("correct-answer")).toBeFalsy();

            for (let i = 0; i < quiz.getQuestion().options.length; i++) {
                if (i !== correctAnswerIndex) {
                    incorrectAnswer = $(`.answer-box[data-option="${i}"]`);
                    break;
                }
            }
            $(incorrectAnswer).find("p.answer-box_text").trigger("click");

            expect($(`.answer-box[data-option="${correctAnswerIndex}"]`).hasClass("correct-answer")).toBeTruthy();
            expect($(incorrectAnswer).hasClass("incorrect-answer")).toBeTruthy();

            $("#next-button").trigger("click");
        }
    });

    test("answer-box classes should be reset for next question", () => {
        $(".answer-box[data-option='1'] > p.answer-box_text").trigger("click");
        $("#next-button").trigger("click");

        expect($(".answer-box").hasClass("incorrect-answer")).toBeFalsy();
        expect($(".answer-box").hasClass("correct-answer")).toBeFalsy();
    });

    test("Next question button shouldn't work if not answered the current question", () => {
        let initalQuestionIndex = quiz.questionIndex;
        $("#next-button").trigger("click");
        expect(quiz.questionIndex).toBe(initalQuestionIndex);
    });
});
