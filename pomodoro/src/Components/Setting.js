

function Setting(props)
{
    let {callback, value, name} = props

    let add = ()=>{
        callback(value++)
    }

    let down = ()=>{
        callback(value--)
    }

    return(
        <div className="settings">
            <p>{name}</p>
            
            <div>
                <span onClick={add} className="material-icons">add</span>
                    <p>{value}</p>
                <span onClick={down} className="material-icons">remove</span>
            </div>
        </div>
    )
}

export default Setting