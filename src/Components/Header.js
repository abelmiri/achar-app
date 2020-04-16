import React, {PureComponent} from "react"
import Logo from "../Media/Images/logo.png"
import Icon from "../Media/Images/logo-colored.png"
import Android from "../Media/Images/Android.png"
import {Link} from "react-router-dom"
import Material from "./Material"
import Hamburger from "./Hamburger"

class Header extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            collapse: true,
        }
        this.deltaX = 0
        this.posX = 0
        this.posY = 0
        this.prevX = null
        this.changing = false
        this.started = false
        this.deltaY = 0
        this.onTouchStart = this.onTouchStart.bind(this)
        this.onTouchMove = this.onTouchMove.bind(this)
        this.onTouchEnd = this.onTouchEnd.bind(this)
    }

    componentDidMount()
    {
        document.addEventListener("touchstart", this.onTouchStart)
        document.addEventListener("touchmove", this.onTouchMove)
        document.addEventListener("touchend", this.onTouchEnd)
    }

    componentWillUnmount()
    {
        document.removeEventListener("touchstart", this.onTouchStart)
        document.removeEventListener("touchmove", this.onTouchMove)
        document.removeEventListener("touchend", this.onTouchEnd)
    }

    checkParentClass(element, classname)
    {
        if (element.className && element.className.toString().split(" ").indexOf(classname) >= 0) return true
        return element.parentNode && this.checkParentClass(element.parentNode, classname)
    }

    onTouchStart(e)
    {
        if (!this.checkParentClass(e.target, "dont-gesture"))
        {
            this.prevX = !this.state.collapse ? 0 : this.sidebar ? this.sidebar.clientWidth : 0
            this.posX = e.touches[0].clientX
            this.posY = e.touches[0].clientY
            this.started = true
        }
    }

    onTouchMove(e)
    {
        this.deltaY = this.posY - e.touches[0].clientY
        this.deltaX = this.posX - e.touches[0].clientX
        if (this.changing || (this.started && this.deltaY < 5 && this.deltaY > -5 && (this.deltaX > 5 || this.deltaX < -5)))
        {
            this.posX = e.touches[0].clientX
            this.prevX = this.prevX - this.deltaX >= 0 ? this.prevX - this.deltaX <= this.sidebar.clientWidth ? this.prevX - this.deltaX : this.sidebar.clientWidth : 0
            this.sidebar.style.transform = `translateX(${this.prevX}px)`
            this.sidebarBack.style.opacity = `${1 - (this.prevX / this.sidebar.clientWidth)}`
            this.sidebarBack.style.height = `100vh`
            if (this.started)
            {
                document.body.style.overflow = "hidden"
                this.changing = true
            }
            this.started = false
        }
        else this.started = false
    }

    onTouchEnd()
    {
        if (this.changing)
        {
            if (!(this.deltaX > 3) && (this.deltaX < -3 || this.prevX >= this.sidebar.clientWidth / 2))
            {
                this.prevX = this.sidebar.clientWidth
                this.hideSidebar()
            }
            else
            {
                this.prevX = 0
                this.showSidebar()
            }
            this.changing = false
        }
    }

    showSidebar = () =>
    {
        this.setState({...this.state, collapse: false})
        this.sidebar.style.transition = "transform linear 0.2s"
        this.sidebar.style.transform = `translateX(0px)`
        this.sidebarBack.style.transition = "opacity linear 0.3s, height linear 0s 0s"
        this.sidebarBack.style.opacity = `1`
        this.sidebarBack.style.height = `100vh`
        document.body.style.overflow = "hidden"
        setTimeout(() =>
        {
            if (this.sidebar) this.sidebar.style.transition = "initial"
            if (this.sidebarBack) this.sidebarBack.style.transition = "initial"
        }, 250)
    }

    hideSidebar = () =>
    {
        this.setState({...this.state, collapse: true})
        this.sidebar.style.transition = "transform linear 0.1s"
        this.sidebar.style.transform = `translateX(100%)`
        this.sidebarBack.style.transition = "opacity linear 0.3s, height linear 0s 0.4s"
        this.sidebarBack.style.opacity = `0`
        this.sidebarBack.style.height = `0`
        document.body.style.overflow = "auto"
        setTimeout(() =>
        {
            if (this.sidebar) this.sidebar.style.transition = "initial"
            if (this.sidebarBack) this.sidebarBack.style.transition = "initial"
        }, 250)
    }

    logout = () =>
    {
        this.hideSidebar()
        this.props.logout()
    }

    render()
    {
        const {user} = this.props
        const {collapse} = this.state
        return (
            <div className={`header-cont ${user ? "" : "center"}`}>
                {
                    user &&
                    <div className="header-section">
                        {/*desktop*/}
                        <Link className="header-logo-link" to="/"><img className="header-logo" src={Logo} alt="logo"/></Link>
                        <div className="header-name">{user.name || user.phone}</div>
                        <Material className="header-log-out" onClick={this.logout}>خروج</Material>
                        {/*desktop*/}

                        {/*mobile*/}
                        <Hamburger className="header-hamburger" collapse={collapse} onClick={collapse ? this.showSidebar : this.hideSidebar}/>
                        <div className="header-sidebar-back" style={{opacity: "0", height: "0"}} ref={e => this.sidebarBack = e} onClick={this.hideSidebar}/>
                        <div className="header-sidebar-container" style={{transform: "translateX(100%)"}} ref={e => this.sidebar = e}>
                            <Link to="/" onClick={this.hideSidebar}><img className="header-logo-side" src={Logo} alt="logo"/></Link>
                            <Material className="header-sidebar-btn name">{user.name || user.phone}</Material>
                            <Link to="/" className="header-sidebar-link" onClick={this.hideSidebar}><Material className="header-sidebar-btn">مشاهده برندگان</Material></Link>
                            <Material className="header-sidebar-log-out" onClick={this.logout}>خروج از حساب</Material>
                        </div>
                        {/*mobile*/}
                    </div>
                }
                <Link to="/" className={`header-section ${user ? "" : "none"}`}>
                    <img src={Icon} className="header-icon" alt="دانلود اپ"/>
                </Link>
                <div className="header-section">
                    <Link className={`header-link ${user ? "" : "show-mobile"}`} to="/">مشاهده برندگان</Link>
                    <a href="/achar.apk" download><img src={Android} className="header-app" alt="دانلود اپ"/></a>
                </div>
            </div>
        )
    }
}

export default Header