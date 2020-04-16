import React from "react"

const Hamburger = (props) =>
{
    const {className, collapse, onClick} = props
    return (
        <div className={className} onClick={onClick}>
            <div className={`${collapse ? "" : "hamburger-one-rotate"} hamburger-line line-one`}/>
            <div className={`${collapse ? "" : "hamburger-line-out"} hamburger-line line-two`}/>
            <div className={`${collapse ? "" : "hamburger-three-rotate"} hamburger-line line-three`}/>
        </div>
    )
}

export default Hamburger