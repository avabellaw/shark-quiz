let decreaseTimer;

let timer = {
    max: 20,
    timer: 20,
    resetTimer: function (callFunction) {
        this.timer = this.max;
        callFunction(this.timer);
    },
    startTimer: function (callFunction) {
        decreaseTimer = setInterval(() => {
            callFunction(--this.timer);
            if (this.timer <= 0) this.stopTimer();
        }, 1000);
    },
    stopTimer: function () {
        if (decreaseTimer !== null) {
            // Exit from setInterval [https://stackoverflow.com/questions/1795100/how-to-exit-from-setinterval]
            clearInterval(decreaseTimer);
            return this.timer;
        }
    }
};

// Exports the functions for Jest to import and test.
if (typeof exports !== "undefined")
    module.exports = timer;