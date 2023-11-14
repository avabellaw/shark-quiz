/**
 * @jest-environment jsdom
*/

const { default: expect } = require("expect");
const { init, quiz, getCurrentGameArea, swapGameArea} = require("../main");

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
    test("answer-box classes should be reset for next question", () => {
        $("answer-box[data-option='1']").trigger();
        $("#next-question").trigger();
        $(".answer-box").each((option) => {
            expect(option.hasClass("incorrect-answer")).toBeFalsy();
        });
    });
});
