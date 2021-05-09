
import Time from "./time.js"


function Circle(props){

    
    let info = props.info
    let {time} = info
    
    return(
        <div className="circle">
            <div className="row align-items-flex-start justify-content-center">
                <p>Session Time</p>
                <Time time={time}/>
                <span className="material-icons">
                    {info.active ? "pause" : "play_arrow" }
                </span>

            </div>
        </div>

    )
}

export default Circle