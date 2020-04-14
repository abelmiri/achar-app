import React, {PureComponent} from "react"
import Material from "./Components/Material"
import Logo from "./Media/Images/logo.png"
import axios from "axios"

class App extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state =
            {
                user: null,
                choice: "",
                phone: "",
                name: "",
                code: "",
                loading: false,
                nextSignUpStep: false,
                codeProblem: false,
                counter: 60,
            }
    }

    componentDidMount()
    {
        let user = null

        if (localStorage.hasOwnProperty("user"))
        {
            user = JSON.parse(localStorage.getItem("user"))
            this.setState({...this.state, user})
        }
    }

    logout = () =>
    {
        localStorage.removeItem("user")
        this.setState({...this.state, user: null})
    }

    choice = (selected) =>
    {
        console.log(selected)
        this.setState({...this.state, choice: selected})
    }

    setName = (name) =>
    {
        name.length < 32 && this.setState({...this.state, name})
    }

    setPhone = (phone) =>
    {
        phone.length <= 11 && this.setState({...this.state, phone})
    }

    setCode = (code) =>
    {
        this.setState({...this.state, code})
    }

    sendCode = () =>
    {
        this.state.phone.length === 11 && this.setState({...this.state, loading: true, codeProblem: false}, () =>
        {
            axios.post("https://restful.achar.tv/code", {phone: this.state.phone})
                .then(() =>
                {
                    this.setState({...this.state, loading: false, nextSignUpStep: true})
                    let inter = setInterval(() =>
                    {
                        if (this.state.counter === 0)
                        {
                            clearInterval(inter)
                            this.setState({...this.state, codeProblem: true})
                        }
                        else this.setState({...this.state, counter: this.state.counter - 1})
                    }, 1000)
                })
                .catch(error => console.log(error))
        })
    }

    signUp = () =>
    {
        console.log("Sign Up")
    }


    render()
    {
        const {user, choice, name, phone, code, loading, nextSignUpStep, counter, codeProblem} = this.state
        if (user) return (
            <div className="home-wrapper">
                <img src={Logo} className="main-logo" alt="logo"/>
                <Material className="main-button">واستا تا بریم داخل</Material>
            </div>
        )
        else return (
            <div className="home-wrapper">
                <img src={Logo} className={`main-logo ${nextSignUpStep ? "sign-up-second-step" : choice}`} alt="logo"/>
                {
                    choice === "login" &&
                    <React.Fragment>
                        <input className="main-input" placeholder="شماره"/>
                        <div className="input-padding"/>
                    </React.Fragment>
                }
                {
                    choice === "sign-up" &&
                    <React.Fragment>
                        <input className="main-input" value={name} placeholder="نام" maxLength="32" type="name" onChange={(event) => this.setName(event.target.value.trim().toLowerCase())}/>
                        <input className="main-input" value={phone} placeholder="شماره" type="number" onChange={(event) => this.setPhone(event.target.value.trim())}/>
                        {
                            nextSignUpStep ?
                                <React.Fragment>
                                    <div className="counter-text">
                                        {counter}
                                    </div>
                                    <div onClick={() => codeProblem && this.sendCode()} className={codeProblem ? "send-code-text" : "disable-send-code-text"}>
                                        ارسال مجدد کد
                                    </div>
                                    <input className="main-input" value={code} placeholder="کد تأیید" type="number" onChange={(event) => this.setCode(event.target.value.trim())}/>
                                </React.Fragment>
                                :
                                <div className="input-padding"/>
                        }
                    </React.Fragment>
                }
                {
                    choice !== "login" &&
                    <Material
                        className={`main-button ${((choice === "sign-up" && phone.length !== 11) || loading || (choice === "sign-up" && nextSignUpStep === true && code.length < 4)) && "inactive"}`}
                        onClick={() =>
                            choice === "" ? this.choice("sign-up")
                                : !loading && code.length >= 4 && phone.length === 11 && name.length !== 0 ? this.signUp()
                                : !loading && code.length === 0 && phone.length === 11 ? this.sendCode() : null
                        }>
                        {choice === "sign-up" && !nextSignUpStep ? "ارسال کد" : "ثبت نام"}
                    </Material>
                }
                {
                    choice !== "sign-up" &&
                    <Material className="main-button" onClick={() => this.choice("login")}>
                        ورود
                    </Material>
                }
            </div>
        )
    }
}

export default App
