/**
 * @jest-environment jsdom
*/

const { default: expect } = require("expect");
const { init, quiz, getCurrentGameArea, swapGameArea } = require("../main");

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
    test("Correct answer box should have the class 'correct-answer'", () => {
        let correctAnswer = quiz.getQuestion().answer;

        $(`.answer-box[data-option="${correctAnswer}"]`).trigger("click");

        setTimeout(() => {
            // Timeout to allow for the click event to trigger
            expect($(`.answer-box[data-option="${correctAnswer}"]`).hasClass("correct-answer")).toBeTruthy();
        }, 10);
    });

    test("If answered wrong, the wrong answer-box should have the class 'incorrect-answer'", () => {
        let correctAnswer = quiz.getQuestion().answer;
        let incorrectAnswer;
        $(".answer-box").each((option)=>{
            if($(option).data("option") != correctAnswer){
                incorrectAnswer = option;
                return;
            }
        });

        $(incorrectAnswer).trigger("click");

        setTimeout(() => {
            expect($(incorrectAnswer).hasClass("incorrect-answer"));
        }, 10);
    });

    test("answer-box classes should be reset for next question", () => {
        $(".answer-box[data-option='1']").trigger("click");
        $("#next-question").trigger("click");
        setTimeout(() => {
            $(".answer-box").each((option) => {
                expect($(option).hasClass("incorrect-answer")).toBeFalsy();
                expect($(option).hasClass("correct-answer")).toBeFalsy();
            });
        }, 10);
    });
});
