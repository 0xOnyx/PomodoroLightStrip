

//https://codepen.io/MayDeypalubos/pen/GdQvzL

import 'bootstrap/dist/css/bootstrap.min.css'

import React, {useEffect, useState} from "react"
import './App.css';
import Pomodoro from "./Components/Pomodoro.js"



import {io} from "socket.io-client"

function App(){
  
  const socket = io()
  
  let [data, setData] = useState({
    active: false,
    position: "time", //"time", //time, finish_time, break , finish_break
    time: 0,  
    colors: {
      red: 0,
      green: 0,
      blue: 0,
    }
  })
  
  
  useEffect(()=>{

    socket.on("pomodoro/info/web", (recv)=>{
      setData(recv)
    })

    return ()=>{socket.disconnect()}
  })

  let restart = ()=>{
    socket.emit("restart")
  }

  let reset = ()=>{
    socket.emit("reset")
  }

  let start = (options)=>{
    console.log(options)
    socket.emit("start_pomodor", options)
  }
    

  return (
    <div className="App">
      <Pomodoro info={data} restart={restart} start={start} reset={reset}/>
    </div>
  );
}

export default App;
