import React from "react"
import * as PropTypes from "prop-types"

class Material extends React.PureComponent
{
    static propTypes = {
        className: PropTypes.string,
        onClick: PropTypes.func,
        content: PropTypes.any,
        backgroundColor: PropTypes.string,
        style: PropTypes.object,
    }

    constructor(props)
    {
        super(props)
        this.pageX = 0
        this.pageY = 0
        this.onMouseDown = this.onMouseDown.bind(this)
        this.handleButtonRelease = this.handleButtonRelease.bind(this)
        this.handleLeave = this.handleLeave.bind(this)
        this.onContext = this.onContext.bind(this)
    }

    onContext(e)
    {
        this.handleLeave(e)
    }

    handleButtonRelease(e)
    {
        clearTimeout(this.buttonPressTimer)
        if (!this.ripple)
        {
            if (this.container && this.pageX !== null)
            {
                let target = this.container
                let rect = target.getBoundingClientRect()
                let ripple = document.createElement("span")
                ripple.className = "ripple"
                if (this.props.backgroundColor) ripple.style.backgroundColor = this.props.backgroundColor
                ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + "px"
                target.appendChild(ripple)
                let top = (e.clientY || this.pageY) - rect.top - ripple.offsetHeight / 2
                let left = (e.clientX || this.pageX) - rect.left - ripple.offsetWidth / 2
                ripple.style.top = top + "px"
                ripple.style.left = left + "px"
                setTimeout(() =>
                {
                    try
                    {
                        target.removeChild(ripple)
                    }
                    catch (e)
                    {
                        console.log("material failed")
                    }
                }, 600)
            }
        }
        else
        {
            this.ripple.style.opacity = "0"
            setTimeout(() =>
            {
                if (this.ripple && this.container)
                {
                    try
                    {
                        this.container.removeChild(this.ripple)
                        this.ripple = null
                    }
                    catch (e)
                    {
                        console.log("material failed")
                    }
                }
            }, 500)
        }
    }

    onMouseDown(e)
    {
        let pageY = e.clientY || (e.touches ? e.touches[0].clientY : 0)
        let pageX = e.clientX || (e.touches ? e.touches[0].clientX : 0)
        this.buttonPressTimer = setTimeout(() =>
        {
            if (this.container)
            {
                let target = this.container
                let rect = target.getBoundingClientRect()
                let ripple = document.createElement("span")
                ripple.className = "rippleSlow"
                if (this.props.backgroundColor) ripple.style.backgroundColor = this.props.backgroundColor
                ripple.style.height = ripple.style.width = 1.3 * Math.max(rect.width, rect.height) + "px"
                target.appendChild(ripple)
                this.ripple = ripple
                let top = pageY - rect.top - ripple.offsetHeight / 2
                let left = pageX - rect.left - ripple.offsetWidth / 2
                ripple.style.top = top + "px"
                ripple.style.left = left + "px"
            }
        }, 300)
        if (e.touches)
        {
            this.pageX = e.touches[0].clientX
            this.pageY = e.touches[0].clientY
        }
    }

    handleLeave(e)
    {
        clearTimeout(this.buttonPressTimer)
        if (this.ripple)
        {
            this.ripple.style.opacity = "0"
            this.ripple.style.transform = "scale(0)"
            setTimeout(() =>
            {
                if (this.ripple && this.container)
                {
                    try
                    {
                        this.container.removeChild(this.ripple)
                        this.ripple = null
                    }
                    catch (e)
                    {
                        console.log("material failed")
                    }
                }
            }, 500)
        }
        this.pageX = e.touches ? null : 0
        this.pageY = e.touches ? null : 0
    }

    render()
    {
        const isMobile = document.body.clientWidth <= 480
        return <div id={this.props.id} ref={e => this.container = e}
                    onContextMenu={isMobile ? this.onContext : null}
                    style={this.props.style ? this.props.style : {}}
                    className={this.props.className ? "material " + this.props.className : "material"}
                    onMouseDown={isMobile ? null : this.onMouseDown}
                    onMouseUp={isMobile ? null : this.handleButtonRelease}
                    onMouseLeave={isMobile ? null : this.handleLeave}
                    onTouchStart={isMobile ? this.onMouseDown : null}
                    onTouchMove={isMobile ? this.handleLeave : null}
                    onTouchEnd={isMobile ? this.handleButtonRelease : null}
                    onClick={this.props.onClick}>
            {this.props.content || this.props.children}
        </div>
    }
}

export default Material

// written by #Hoseyn