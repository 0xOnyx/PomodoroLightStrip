const cliProgress = require("cli-progress")
const colors      = require("colors")

const bar = new cliProgress.SingleBar({
    format: "Pomodoro progress: |" 
    + colors.cyan('{bar}') 
    + "| {percentage}% || {value}/{total} time"

}, cliProgress.Presets.shades_classic)



//Temps en seconde 
class Pomodoro{
    constructor(callbackFinishTime, callbackFinishBreak, time = 25, pause = 5, auto = false, nombre = 1){
        this.time   = {
            time : time * 60 * 1000,
            break: pause * 60 * 1000,
            auto: auto,
            nombre: nombre,
        }

        this.callback = {
            callbackFinishTime: callbackFinishTime,
            callbackFinishBreak: callbackFinishBreak,
        }

        this.currentTime
        this.timeStart
        this.iteration = 0;
    }


    startTime(){
        this.currentTime = Date.now()
        this.timeStart = Date.now()
        bar.start(this.time.time, 0)

        while((this.currentTime - this.timeStart) < this.time.time)
        {
            this.currentTime = Date.now()
            bar.update((this.currentTime - this.timeStart))
        }

        this.callback.callbackFinishTime()
        
        if(this.time.auto){       //si automatique lauch directly
            this.startBreak()
            console.log("launch break")
        }

        bar.stop()
        
    }

    startBreak(){
        this.currentTime = Date.now()
        this.timeStart = Date.now()
        bar.start(this.time.break, 0)

        while((this.currentTime - this.timeStart) < this.time.break)
        {
            this.currentTime = Date.now()
            bar.update((this.currentTime - this.timeStart))
        }

        this.iteration += 1
        this.callback.callbackFinishBreak()

        if(this.time.auto && this.iteration < this.time.nombre){       //si automatique lauch directly
            this.startTime()
            console.log("New pomodoro")
        }

        bar.stop()
        
    }



}   

exports.Pomodoro = Pomodoro