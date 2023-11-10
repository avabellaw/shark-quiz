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

describe(".game-area transitions work correctly", () => {
    test("Initially, currentGameArea should be #home", () => {
        expect(currentGameArea).toBe("#home");
    });
    test("swapGameArea should swap from #home to #quiz", () => {
        expect(currentGameArea).toBe("#home")
        expect(swapGameArea("#quiz")).toBe("#quiz");
        expect(document.getElementById("quiz").dataset.visible).toEqual("true");
        expect(document.getElementById("home").dataset.visible).toEqual("false");
    });
});