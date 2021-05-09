
import {useState} from "react"

import Setting from "./Setting.js"
import "./Setting.css"

function Options(props)
{
    let {start,reset} = props

    /*{
        time: 25,
        break: 5,
        iteration: 1,
        auto: false,
    }*/

    let [time, setTime] = useState(25)
    let [breaktime, setBreak] = useState(5)
    let [iteration, setIteration] = useState(5)

    
    let submit = ()=>{
        let options = {
            time: time,
            break: breaktime,
            iteration: iteration,
            auto: false,
        }
        start(options)
    }

    return(
        <div className="col-xs-12 options">
            <div className="row align-items-start justify-content-center">
                <Setting callback={setTime} value={time} name={"Time"}/>
                <Setting callback={setBreak} value={breaktime} name={"Break"}/>
                <Setting callback={setIteration} value={iteration} name={"Iteration"}/>
                
                <div className="submit">
                    <span onClick={submit} className="material-icons">
                        play_arrow
                    </span>
                    <span onClick={reset} className="material-icons">
                        restart_alt
                    </span>
                </div>
            </div>

        </div>
    )
}

export default Options