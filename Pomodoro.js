const cliProgress = require("cli-progress")
const colors      = require("colors")


const bar = new cliProgress.SingleBar({
    format: "Pomodoro progress: |" 
    + colors.cyan('{bar}') 
    + "| {percentage}% || {value}/{total} time"

}, cliProgress.Presets.shades_classic)



//Temps en seconde 
class Pomodoro{
    constructor(yeelight, callbackFinishTime, callbackFinishBreak, time = 25, pause = 5, auto = false, nombre = 1, mqtt, io){
        
        this.mqtt = mqtt
        this.yeelight = yeelight
        this.io = io

        this.COLORS = 
        {
            time: {red: 162, green: 155, blue: 254},
            finish_time:  {red: 252, green: 207, blue: 3},
            break: {red: 253  , green: 203, blue: 110 },
            finish_break: {red: 252, green: 3  , blue: 3},
            finish: {red: 255, green: 255, blue: 255}
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
            active: false,
            position: "time", //time, finish_time, break , finish_break
            time: 0,  //time sur 100%
            iteration: 0,
            maxIteration: nombre,
            colors: {
                red: 0,
                green: 0,
                blue: 0
            }
            
        }

        this.mqtt.publish("pomodoro/info", JSON.stringify(this.data_to_mqtt))
        this.io.emit("pomodoro/info", this.data_to_mqtt)
        this.yeelight.set_power("on")
    }

    pushToLight(rgb)
    {    
        return new Promise((resolve, reject)=>{
            this.yeelight.set_rgb(Object.values(rgb))
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
            
            this.io.emit("pomodoro/info/web", this.data_to_mqtt)

            setTimeout(()=>{
                resolve()
            }, 3000)
        })
    }

    timer(timeToBreak, status){
        return new Promise(async (resolve, reject)=>{
            this.currentTime = Date.now()
            this.timeStart = Date.now()
            //bar.start(timeToBreak, 0)
            this.data_to_mqtt.time = 0
            this.data_to_mqtt.position = status
            await this.pushToMqtt(status)
            
            while(true)
            {
                let difference = this.currentTime - this.timeStart
                this.currentTime = Date.now()
                //bar.update(difference)

                let pourcentage = ((difference) * 100) / timeToBreak
                pourcentage = Math.round(pourcentage)

                if(this.data_to_mqtt.time < pourcentage){
                    this.data_to_mqtt.time = pourcentage
                    await this.pushToMqtt(status)
                }

                
                if(difference >= timeToBreak )
                {
                    //bar.stop()
                    resolve()
                    break
                }
                
                if(!this.data_to_mqtt.active)
                {
                    this.data_to_mqtt.active = false
                    this.data_to_mqtt.position = "time"
                    this.data_to_mqtt.time = 0
                    this.data_to_mqtt.colors = this.COLORS.finish
        
                    setTimeout(async ()=>{
                        await this.pushToLight(this.data_to_mqtt.colors)
                        await this.pushToMqtt()
                    }, (3 * 1000) )  
                    break
                }

            }  
        })
    }

    async startTime(){

        this.data_to_mqtt.active = true

        let flow = [
            [2000, 1, 2600544, 100], //#27ae60
            [2000, 1, 3066993, 100],//#2ecc71
            [2000, 1, 1752220, 100],//#1abc9c
            [2000, 1, 1482885, 100],//#16a085
        ]

        
        this.data_to_mqtt.colors = this.COLORS.time
        this.data_to_mqtt.active = true
        await this.pushToLight(this.data_to_mqtt.colors)
        await this.timer(this.time.time, "time")
        
        flow = [
            [1900, 1, 16724736, 100]
        ]
        
        
        this.data_to_mqtt.colors = this.COLORS.finish_time
        await this.pushToLight(this.data_to_mqtt.colors)
        this.data_to_mqtt.position = "finish_time"
        this.data_to_mqtt.time = 100
        await this.pushToMqtt()
        
        this.callback.callbackFinishTime()

        if(this.time.auto){       //si automatique lauch directly
            this.startBreak()
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

        
        this.data_to_mqtt.colors = this.COLORS.break
        await this.pushToLight(this.data_to_mqtt.colors)
        await this.timer(this.time.break, "break")

        flow = [
            [1900, 1, 16724736, 100], 
            //[1900, 1, 16750899, 100],
            //[1900, 1, 15105570, 100],
        ]
    
        
        this.data_to_mqtt.iteration += 1
        this.data_to_mqtt.colors = this.COLORS.finish_break
        await this.pushToLight(this.data_to_mqtt.colors)
        this.data_to_mqtt.position = "finish_break"
        this.data_to_mqtt.time = 100
        await this.pushToMqtt()


        this.iteration += 1
        this.callback.callbackFinishBreak()

        if(this.time.auto && this.iteration < this.time.nombre){       //si automatique lauch directly
            this.startTime()
        }
        else if(!this.time.auto && this.iteration > this.time.nombre)
        {
            this.data_to_mqtt.active = false
            this.data_to_mqtt.position = "time"
            this.data_to_mqtt.time = 0
            this.data_to_mqtt.colors = this.COLORS.finish

            setTimeout(async ()=>{
                await this.pushToLight(this.data_to_mqtt.colors)
                await this.pushToMqtt()
            }, (70 * 1000) )  
        
        }
        
    }



}   

exports.Pomodoro = Pomodoro