const cliProgress = require("cli-progress")
const colors      = require("colors")


const bar = new cliProgress.SingleBar({
    format: "Pomodoro progress: |" 
    + colors.cyan('{bar}') 
    + "| {percentage}% || {value}/{total} time"

}, cliProgress.Presets.shades_classic)



//Temps en seconde 
class Pomodoro{
    constructor(yeelight, callbackFinishTime, callbackFinishBreak, time = 25, pause = 5, auto = false, nombre = 1, mqtt){
        
        this.mqtt = mqtt
        this.yeelight = yeelight,

        this.COLORS = 
        {
            time: {red: 94, green: 252, blue: 3},
            finish_time:  {red: 252, green: 207, blue: 3},
            break: {red: 3  , green: 157, blue: 252 },
            finish_break: {red: 252, green: 3  , blue: 3},
        }

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

        this.data_to_mqtt = {
            active: true,
            position: "time", //time, finish_time, break , finish_time
            time: 0,  //time sur 100%
            colors: {
                red: 0,
                green: 0,
                blue: 0
            }
            
        }

        this.mqtt.publish("pomodoro/info", JSON.stringify(this.data_to_mqtt))
        this.yeelight.set_power("on")
    }

    pushToLight(flow)
    {    
        return new Promise((resolve, reject)=>{
            this.yeelight.stop_cf()
            this.yeelight.start_cf(0, 1, flow)
            setTimeout(()=>{resolve()}, 3000)
        })
        
    }

    pushToMqtt()
    {
        return new Promise((resolve, reject)=>{
            this.mqtt.publish("pomodoro/info", JSON.stringify(this.data_to_mqtt), (err)=>{
                if(err){
                    console.log("mqtt error => " + err)
                    reject()
                }
            })
            setTimeout(()=>{resolve()}, 2000)
        })
    }

    timer(timeToBreak, status){
        return new Promise(async (resolve, reject)=>{
            this.currentTime = Date.now()
            this.timeStart = Date.now()
            bar.start(timeToBreak, 0)
            this.data_to_mqtt.time = 0
            
            while(true)
            {
                let difference = this.currentTime - this.timeStart
                this.currentTime = Date.now()
                bar.update(difference)

                let pourcentage = ((difference) * 100) / timeToBreak
                pourcentage = Math.round(pourcentage)
                if(this.data_to_mqtt.time < pourcentage){
                    this.data_to_mqtt.time = pourcentage
                    this.data_to_mqtt.position = status
                    console.log(this.data_to_mqtt)
                    await this.pushToMqtt(status)
                }

                if(difference >= timeToBreak)
                {
                    bar.stop()
                    resolve()
                    break
                }
            }  
        })
    }

    async startTime(){

        let flow = [
            [2000, 1, 2600544, 100], //#27ae60
            [2000, 1, 3066993, 100],//#2ecc71
            [2000, 1, 1752220, 100],//#1abc9c
            [2000, 1, 1482885, 100],//#16a085
        ]

        await this.pushToLight(flow)

        this.data_to_mqtt.colors = this.COLORS.time
        await this.timer(this.time.time, "time")
        
        flow = [
            [1900, 1, 16724736, 100]
        ]
        
        await this.pushToLight(flow)

        this.data_to_mqtt.colors = this.COLORS.finish_time
        this.data_to_mqtt.position = "finish_time"
        this.data_to_mqtt.time = 100
        await this.pushToMqtt()
        
        this.callback.callbackFinishTime()

        if(this.time.auto){       //si automatique lauch directly
            this.startBreak()
            console.log("launch break")
        }
    }

    async startBreak(){

        if(this.data_to_mqtt.position !== "finish_time"){
            return
        }

        let flow = [
            [1900, 1, 3381759, 100], 
            //[1900, 1, 16750899, 100],
            //[1900, 1, 15105570, 100],
        ]

        await this.pushToLight(flow)

        this.data_to_mqtt.colors = this.COLORS.break
        await this.timer(this.time.break, "break")

        flow = [
            [1900, 1, 16724736, 100], 
            //[1900, 1, 16750899, 100],
            //[1900, 1, 15105570, 100],
        ]
    
        await this.pushToLight(flow)

        this.data_to_mqtt.colors = this.COLORS.finish_break
        this.data_to_mqtt.position = "finish_break"
        this.data_to_mqtt.time = 100
        await this.pushToMqtt()


        this.iteration += 1
        this.callback.callbackFinishBreak()

        if(this.time.auto && this.iteration < this.time.nombre){       //si automatique lauch directly
            this.startTime()
            console.log("New pomodoro")
        }
        
    }



}   

exports.Pomodoro = Pomodoro