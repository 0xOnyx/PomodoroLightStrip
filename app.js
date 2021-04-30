
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


const {Yeelight}   = require("yeelight-node")
const {Pomodoro} = require("./Pomodoro.js")

const yeelight = new Yeelight({ip: "", port: 55443})


const finishTime = ()=>{

}

const finishBreak = ()=>{
    
}

const start = async ()=>{
    pm = new Pomodoro()

}

let pm = new Pomodoro(
    ()=>{console.log("timefinish")}, 
    ()=>{console.log("timebreakfinish"),
    1,
    2
})

pm.startTime()