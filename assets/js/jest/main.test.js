/**
 * @jest-environment jsdom
*/

const { default: expect } = require("expect");
const { init, showHomeScreen, currentGameArea, swapGameArea} = require("../main");

beforeAll(() => {
    let fs = require("fs");
    let fileContents = fs.readFileSync("index.html", "utf-8");
    document.open();
    document.write(fileContents);
    document.close();
});

describe("Quiz is initialised correctly", () => {
    test("All game-areas should be hidden after init", () => {
        init();
        let gameAreas = document.getElementsByClassName("game-area");

        for (let gameArea of gameAreas) {
            expect(gameArea.style.display).toEqual("none");
        }
    });
    test("showHomeScreen function should make .game-area#home visible", () => {
        showHomeScreen();
        let gameArea = document.getElementById("home");

        expect(gameArea.style.display).not.toEqual("none");
    });
});

describe(".game-area transitions work correctly", () => {
    test("Initially, currentGameArea should be #home", () => {
        expect(currentGameArea).toBe("#home");
    });
    test("swapGameArea should swap from #home to #quiz", () => {
        expect(currentGameArea).toBe("#home")
        expect(swapGameArea("#quiz")).toBe("#quiz");
        expect(document.getElementById("quiz").style.display).not.toEqual("none");
        expect(document.getElementById("home").style.display).toEqual("none");
    });
});