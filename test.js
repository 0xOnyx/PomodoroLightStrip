const yeelightNode = require("yeelight-node")
const {Yeelight} = require("yeelight-node")

const yeelight = new Yeelight({ip : "192.168.1.228", port: 55443})



yeelight.set_power(process.argv[2])

let flow = [
    [1900, 1, 15105570, 100], 
    [1900, 1, 16750899, 100],
    [1900, 1, 15105570, 100],
]

//yeelight.start_cf(0, 0, flow)
//yeelight.stop_cf()
//yeelight.set_rgb([100, 255, 100], "smooth", 700)
//yeelight.set_bright(10, "smooth", 700)
//yeelight.start_cf(0, 1, )

//yeelight.set_power("on")
/*
yeelight.get_prop("bright").then(data=>{
    console.log(data)
}).catch(err=> console.log(err))

*/