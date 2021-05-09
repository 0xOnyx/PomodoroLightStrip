

//"time", //time, finish_time, break , finish_break

function Emit(props)
{
    let {info, restart} = props

    let value = info.position.includes("time") ? "Break 🔥" : "Works⚔️"  

    return(
        <div className="col-xs-12 reset" onClick={()=>{
            restart()
        }}>
            <p>{value}</p>
        </div>
    )
}


export default Emit