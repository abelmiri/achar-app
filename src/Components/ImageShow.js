import React, {PureComponent} from "react"
import {Helmet} from "react-helmet"

class ImageShow extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            showPicture: false,
        }
    }

    componentDidMount()
    {
        window.addEventListener("popstate", this.onPopState)
    }

    componentWillUnmount()
    {
        window.removeEventListener("popstate", this.onPopState)
    }

    onPopState = () =>
    {
        if (this.state.showPicture) this.closeImage()
    }

    openImage = e =>
    {
        e.stopPropagation()
        this.setState({...this.state, showPicture: true}, () =>
        {
            document.body.style.overflow = "hidden"
            window.history.pushState("", "", `${window.location.href}/show-picture`)
            const rect = this.img.getBoundingClientRect()
            const copyImage = this.img.cloneNode(true)
            copyImage.onclick = () => document.body.clientWidth > 480 && window.history.back()
            copyImage.id = "picture"
            copyImage.style.margin = "0"
            copyImage.style.maxHeight = "initial"
            copyImage.style.maxWidth = "initial"
            copyImage.style.position = "fixed"
            copyImage.style.top = rect.top + "px"
            copyImage.style.height = rect.height + "px"
            copyImage.style.width = rect.width + "px"
            copyImage.style.left = rect.left + "px"
            copyImage.style.right = "auto"
            copyImage.style.zIndex = "11"
            const backGround = document.createElement("div")
            backGround.id = "backGround"
            backGround.className = "back-cont"
            backGround.onclick = () => window.history.back()
            document.body.append(backGround)
            document.body.append(copyImage)
            this.img.style.opacity = "0"
            copyImage.style.transition = "all ease-in-out 0.2s"
            setTimeout(() =>
            {
                if (copyImage.naturalWidth / copyImage.naturalHeight > window.innerWidth / window.innerHeight)
                {
                    copyImage.style.top = (window.innerHeight - (window.innerWidth / copyImage.naturalWidth) * copyImage.naturalHeight) / 2 + "px"
                    copyImage.style.left = "0px"
                    copyImage.style.width = window.innerWidth + "px"
                    copyImage.style.height = (window.innerWidth / copyImage.naturalWidth) * copyImage.naturalHeight + "px"
                    copyImage.style.borderRadius = "0"
                }
                else
                {
                    copyImage.style.top = "0px"
                    copyImage.style.left = (window.innerWidth - (window.innerHeight / copyImage.naturalHeight) * copyImage.naturalWidth) / 2 + "px"
                    copyImage.style.height = window.innerHeight + "px"
                    copyImage.style.width = (window.innerHeight / copyImage.naturalHeight) * copyImage.naturalWidth + "px"
                    copyImage.style.borderRadius = "0"
                }
            }, 50)
        })
    }

    closeImage = () =>
    {
        this.setState({...this.state, showPicture: false}, () =>
        {
            document.body.style.overflow = "auto"
            const rect = this.img.getBoundingClientRect()
            const copyImage = document.getElementById("picture")
            const backGround = document.getElementById("backGround")
            backGround.className = "back-cont hide"
            copyImage.style.top = rect.top + "px"
            copyImage.style.height = rect.height + "px"
            copyImage.style.width = rect.width + "px"
            copyImage.style.left = rect.left + "px"
            copyImage.style.borderRadius = this.img.style.borderRadius
            copyImage.style.right = "auto"
            setTimeout(() =>
            {
                this.img.style.opacity = "1"
                copyImage.remove()
                backGround.remove()
            }, 300)
        })
    }

    render()
    {
        const {showPicture} = this.state
        const {className, src, alt} = this.props
        return <React.Fragment>
            <img className={className} src={src} alt={alt} ref={e => this.img = e} onClick={this.openImage}/>
            <Helmet>
                {
                    showPicture ?
                        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes"/>
                        :
                        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>
                }
            </Helmet>
        </React.Fragment>
    }
}

export default ImageShow