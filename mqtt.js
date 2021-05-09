
const fs = require("fs")

const mqtt = require("mqtt")


let options = {
    username: "client",
    password: fs.readFileSync("./PASS/MQTT", "utf-8")
}

//let client = mqtt.connect("mqtt://10.10.1.254", options)
let client = mqtt.connect("mqtt://192.168.1.215", options)

client.on("connect", ()=>{
    console.log("MQTT OK")
})


exports.client = client