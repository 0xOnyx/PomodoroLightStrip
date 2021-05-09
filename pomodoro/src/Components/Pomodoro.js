

import "./Pomodoro.css"

import Circle from "./Circle.js"
import Options from "./Options.js"
import Emit from "./Emit.js"

/*


        this.data_to_mqtt = {
            active: false,
            position: "time", //time, finish_time, break , finish_break
            time: 0,  //time sur 100%
            iteration: 1,
            maxIteration 5,
            colors: {
                red: 0,
                green: 0,
                blue: 0
            }
            
        }

*/

function Pomodoro(props){
    let {info, restart, start, reset} = props


    return(
        <div className="container">
            <div className="row align-items-center justify-content-center"
                style={{
                    backgroundColor: "#0A708A",//()`rgb(${red}, ${green}, ${blue})`
                }}
            >
                <div id="pomodoro" className="col-xs-12 col-md-7">
                    <div className="row align-items-center justify-content-center">
                        <h1>Pomodoro 🍅 Timer</h1>
                        <Circle info={info}/>
                        <Options start={start} reset={reset}/>
                        <Emit info={info} restart={restart}/>
                    </div>
                </div>



            </div>
        </div>
    )
}


export default Pomodoro