import React, {PureComponent} from "react"
import {Route, Switch} from "react-router-dom"
import Material from "./Components/Material"
import Logo from "./Media/Images/logo.png"
import axios from "axios"
import WeeksPage from "./Components/WeeksPage"
import QuestionsPage from "./Components/QuestionsPage"

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
                error: false,
                codeError: false,
                nextSignUpStep: false,
                nextLoginStep: false,
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

    // logout = () =>
    // {
    //     localStorage.removeItem("user")
    //     this.setState({...this.state, user: null})
    // }

    choice = (selected) =>
    {
        // console.log(selected)
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
        this.state.codeError ?
            this.setState({...this.state, code, codeError: false}) : this.setState({...this.state, code})
    }

    sendCode = () =>
    {
        const {choice, phone} = this.state
        phone.length === 11 && this.setState({...this.state, loading: true, codeProblem: false, counter: 60, error: false}, () =>
        {
            axios.post("https://restful.achar.tv/code/", {phone})
                .then(() =>
                {
                    choice === "sign-up" ?
                        this.setState({...this.state, loading: false, nextSignUpStep: true}) :
                        this.setState({...this.state, loading: false, nextLoginStep: true})
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
                .catch((err) =>
                {
                    this.setState({...this.state, error: true, loading: false})
                    console.log(" %cERROR ", "color: orange; font-size:12px; font-family: 'Helvetica',consolas,sans-serif; font-weight:900;", err.response)
                })
        })
    }

    signUp = () =>
    {
        const {code, phone, name} = this.state
        phone.length === 11 &&
        name.length > 0 &&
        code.length > 3 &&
        this.setState({...this.state, loading: true, codeError: false}, () =>
        {
            axios.post("https://restful.achar.tv/user/login-sign-up/", {code, phone, name})
                .then((res) => this.setState({...this.state, loading: false, user: res.data}, () => localStorage.setItem("user", JSON.stringify(res.data))))
                .catch((err) =>
                {
                    this.setState({...this.state, codeError: true, loading: false})
                    console.log(" %cERROR ", "color: orange; font-size:12px; font-family: 'Helvetica',consolas,sans-serif; font-weight:900;", err.response)
                })
        })
    }

    login = () =>
    {
        const {code, phone} = this.state
        phone.length === 11 &&
        code.length > 3 &&
        this.setState({...this.state, loading: true, codeError: false}, () =>
        {
            axios.post("https://restful.achar.tv/user/login-sign-up/", {code, phone})
                .then((res) => this.setState({...this.state, loading: false, user: res.data}, () => localStorage.setItem("user", JSON.stringify(res.data))))
                .catch((err) =>
                {
                    this.setState({...this.state, codeError: true, loading: false})
                    console.log(" %cERROR ", "color: orange; font-size:12px; font-family: 'Helvetica',consolas,sans-serif; font-weight:900;", err.response)
                })
        })
    }


    render()
    {
        const {user, choice, name, phone, code, loading, error, codeError, nextSignUpStep, nextLoginStep, counter, codeProblem} = this.state
        if (user) return (
            <div className="wrapper">
                <Switch>
                    <Route exact path="/" render={() => <WeeksPage user={user}/>}/>
                    <Route path="/questions/:bookId" render={(route) => <QuestionsPage user={user} bookId={route.match.params.bookId}/>}/>
                </Switch>
            </div>
        )
        else return (
            <div className="home-wrapper">
                <img src={Logo} className={`main-logo ${nextSignUpStep || nextLoginStep ? "sign-up-second-step" : choice}`} alt="logo"/>
                {
                    choice === "login" &&
                    <React.Fragment>
                        <input className="main-input" value={phone} placeholder="شماره" type="number" onChange={(event) => this.setPhone(event.target.value.trim())}/>
                        {
                            nextLoginStep ?
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
                    <Material
                        className={`main-button ${((choice === "login" && phone.length !== 11) || loading || (choice === "login" && nextLoginStep === true && code.length < 4)) && "inactive"}`}
                        onClick={() =>
                            choice === "" ? this.choice("login")
                                : !loading && code.length >= 4 && phone.length === 11 ? this.login()
                                : !loading && code.length === 0 && phone.length === 11 ? this.sendCode() : null
                        }>
                        {choice === "login" && !nextLoginStep ? "ارسال کد" : "ورود"}
                    </Material>
                }
                {error && <div className="error-text">در دریافت اطلاعات خطایی رخ داده!</div>}
                {codeError && <div className="error-text">کد وارد شده غلط است!</div>}
            </div>
        )
    }
}

export default App
