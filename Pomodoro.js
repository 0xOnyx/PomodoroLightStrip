const cliProgress = require("cli-progress")
const colors      = require("colors")

const bar = new cliProgress.SingleBar({
    format: "Pomodoro progress: |" 
    + colors.cyan('{bar}') 
    + "| {percentage}% || {value}/{total} time"

}, cliProgress.Presets.shades_classic)

//add date ?

class Pomodoro{
    constructor(callbackFinishTime, callbackFinishBreak, time = 25, pause = 5, auto = false){
        this.time   = {
            time : time,
            break: pause,
            auto: auto,
        }

        this.callback = {
            callbackFinishTime: callbackFinishTime,
            callbackFinishBreak: callbackFinishBreak,
        }

        this.currentTime = 0;
        this.interval

        bar.start(this.time.time, 0)
    }


    startTime(){
        this.interval = setInterval(()=>{
            this.currentTime += 1
            bar.update(this.currentTime)
            if(this.currentTime == this.time.time)
                this.stopTime()
        }, 1000)
    }

    stopTime(){
        clearInterval(this.interval)
        this.currentTime = 0
        bar.stop()
        bar.start(this.time.break, 0)
        if(this.time.auto){
            this.startBreak()
            console.log("OK")
        }
        this.callback.callbackFinishTime()
    }

    startBreak(){
        this.interval = setInterval(()=>{
            this.currentTime += 1
            bar.update(this.currentTime)
            if(this.currentTime == this.time.break)
                this.stopBreak()
        }, 1000)
    }

    stopBreak(){
        clearInterval(this.interval)
        this.currentTime = 0
        bar.stop()
        this.callback.callbackFinishBreak()
    }

}   


exports.Pomodoro = Pomodoro