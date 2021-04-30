
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

const yeelight = new Yeelight({ip: "192.168.1.228", port: 55443})



const finishTime = ()=>{

    let flow = [
        [1900, 1, 16724736, 100], 
        //[1900, 1, 16750899, 100],
        //[1900, 1, 15105570, 100],
    ]

    yeelight.stop_cf()
    yeelight.start_cf(0, 1, flow)
}

const finishBreak = ()=>{
    let flow = [
        [1900, 1, 16724736, 100], 
        //[1900, 1, 16750899, 100],
        //[1900, 1, 15105570, 100],
    ]

    yeelight.stop_cf()
    yeelight.start_cf(0, 1, flow)
}

const start = async ()=>{
    let flow = [
        [1900, 1, 65280, 100], 
        //[1900, 1, 16750899, 100],
        //[1900, 1, 15105570, 100],
    ]

    yeelight.stop_cf()
    yeelight.start_cf(0, 1, flow)

    let pm = new Pomodoro(finishTime, finishBreak, 25 *60, 1 * 60, false)
    pm.startTime()

    setTimeout(()=>{
        pm.startBreak()

        let flow = [
            [1900, 1, 3381759, 100], 
            //[1900, 1, 16750899, 100],
            //[1900, 1, 15105570, 100],
        ]
    
        yeelight.stop_cf()
        yeelight.start_cf(0, 1, flow)
    }, (28 * 60 * 1000) )

    //await checkValide()


}

start()
