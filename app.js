
/*

https://www.yeelight.com/download/Yeelight_Inter-Operation_Spec.pdf

const cliProgress = require("cli-progress")
const colors      = require("colors")

const bar = new cliProgress.SingleBar({
    format: "Pomodoro progress: |" 
    + colors.cyan('{bar}') 
    + "| {percentage}% || {value}/{total} time"

}, cliProgress.Presets.shades_classic)

bar.start(200, 0)

bar.update(100)

bar.stop()
*/

const socketIo      = require("socket.io")
const http          = require("http")
const {Yeelight}    = require("yeelight-node")
const {Pomodoro}    = require("./Pomodoro.js")

const express       = require("express")


const app         = express()
const {client}    = require("./mqtt.js")


const yeelight = new Yeelight({ip: "192.168.1.228", port: 55443})

const server = http.createServer(app)
let io = socketIo(server, 
    {cors: {
        origin: "*"
    }
    })
server.listen(process.env.PORT || 878)


const finishTime = ()=>{}

const finishBreak = ()=>{}


let pm = new Pomodoro(yeelight, finishTime, finishBreak, 25 , 5 , false, 5, client, io)

//let pm = new Pomodoro(yeelight, finishTime, finishBreak, 25 , 5 , false, 5, client, io)
//pm.startTime()

io.on("connection", (socket)=>{
    socket.on("start_pomodor", (data)=>{
        if(pm.data_to_mqtt.active)
            return 
        
        let options = {
            time: data.time || 25,
            break: data.break || 5,
            iteration: data.break || 1,
            auto: data.auto || false,
        }

        if(!pm.data_to_mqtt.active)
        {
            pm = new Pomodoro(
                    yeelight,
                    finishTime, finishBreak,
                    options.time , options.break, options.auto, options.iteration, 
                    client, io
                )
            pm.startTime()
        }   
    })

    socket.on("restart", ()=>{
        if(!pm.data_to_mqtt.active)
            return 
        
        if(pm.data_to_mqtt.position === "finish_time")
            pm.startBreak()

        if(pm.data_to_mqtt.position === "finish_break")
            pm.startTime()

    })

    socket.on("reset", ()=>{
        if(pm.data_to_mqtt.active)
            pm.data_to_mqtt.active = false
            pm.data_to_mqtt.iteration = pm.time.nombre
    })
})  

//setTimeout(()=>{yeelight.closeConnection()}, 2000)



app.use(express.static(__dirname + "/pomodoro/build"))

app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/pomodoro/build/index.html")
})