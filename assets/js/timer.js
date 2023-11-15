let decreaseTimer;

let timer = {
    timer: 30,
    resetTimer: function (callFunction) {
        this.timer = 30;
        callFunction(this.timer);
    },
    startTimer: async function (callFunction) {
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
}