

class Pomodoro{
    constructor(callbackFinishTime, callbackFinishBreak, time = 25, pause = 5){
        this.time   = {
            time : time,
            break: pause,
        }

        this.callback = {
            callbackFinishTime: callbackFinishTime,
            callbackFinishBreak: callbackFinishBreak,
        }

        this.currentTime = 0;
        this.interval
    }


    startTime(){
        this.interval = setInterval(()=>{
            this.currentTime += 1
            if(this.currentTime == this.time.time)
                this.stopTime()
        }, 1000)
    }

    stopTime(){
        clearInterval(this.interval)
        this.currentTime = 0
        this.startBreak()
        this.callback.callbackFinishTime()
    }

    startBreak(){
        this.interval = setInterval(()=>{
            this.currentTime += 1
            if(this.currentTime == this.time.break)
                this.stopBreak()
        }, 1000)
    }

    stopBreak(){
        clearInterval(this.interval)
        this.currentTime = 0
        this.callback.callbackFinishBreak()
    }

}   


exports.Pomodoro = Pomodoro