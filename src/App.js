import React, {PureComponent} from "react"
import {Route, Switch, Redirect} from "react-router-dom"
import Material from "./Components/Material"
import Logo from "./Media/Images/logo.png"
import axios from "axios"
import WeeksPage from "./Components/WeeksPage"
import QuestionsPage from "./Components/QuestionsPage"
import Header from "./Components/Header"
import SummaryPage from "./Components/SummaryPage"
import AboutUs from "./Components/AboutUs"
import Winners from "./Components/Winners"

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
        const {location} = this.props
        if (location.pathname.includes("/show-picture"))
        {
            let currentPath = location.pathname.replace("/show-picture", "")
            window.history.replaceState("", "", currentPath ? currentPath : "/")
            document.location.reload()
        }

        let user = null

        if (localStorage.hasOwnProperty("user"))
        {
            user = JSON.parse(localStorage.getItem("user"))
            this.setState({...this.state, user})
        }

        window.addEventListener("popstate", this.onPopState)
        window.addEventListener("keypress", this.keyPress)
    }

    componentWillUnmount()
    {
        window.removeEventListener("popstate", this.onPopState)
        window.removeEventListener("keypress", this.keyPress)
    }

    onPopState = () =>
    {
        const {location} = this.props
        if (location.pathname === "/" && this.state.choice !== "")
        {
            this.setState({...this.state, choice: ""})
        }
    }

    keyPress = (e) =>
    {
        if (e.keyCode === 13)
        {
            const {name, phone, code, loading, choice} = this.state

            if (choice === "login")
            {
                !loading && code.length >= 4 && phone.length === 11 && this.login()
                !loading && code.length === 0 && phone.length === 11 && this.sendCode()
            }
            if (choice === "sign-up")
            {
                !loading && code.length >= 4 && phone.length === 11 && name.length !== 0 && this.signUp()
                !loading && code.length === 0 && phone.length === 11 && this.sendCode()
            }
        }
    }

    logout = () =>
    {
        localStorage.removeItem("user")
        this.setState({...this.state, user: null})
    }

    choice = (selected) =>
    {
        this.setState({...this.state, choice: selected})
        window.history.pushState("", "", `/${selected}`)
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
            axios.post("https://restful.ketabekhoob.ir/code/", {phone})
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
            axios.post("https://restful.ketabekhoob.ir/user/login-sign-up/", {code, phone, name: name.trim()})
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
            axios.post("https://restful.ketabekhoob.ir/user/login-sign-up/", {code, phone})
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
        const {location} = this.props
        return (
            <React.Fragment>
                <Header location={location} user={user} logout={this.logout}/>
                {
                    user ?
                        <div className="wrapper">
                            <Switch>
                                <Route exact path="/" render={() => <WeeksPage location={location} user={user}/>}/>
                                <Route path="/about" render={() => <AboutUs/>}/>
                                <Route path="/winners" render={() => <Winners/>}/>
                                <Route path="/questions/:bookId" render={(route) => <QuestionsPage user={user} bookId={route.match.params.bookId}/>}/>
                                <Route path="/summary/:bookId" render={(route) => <SummaryPage user={user} bookId={route.match.params.bookId}/>}/>
                                <Route path="*" render={() => <Redirect to="/"/>}/>
                            </Switch>
                        </div>
                        :
                        <Switch>
                            <Route path="/about" render={() => <div className="wrapper"><AboutUs/></div>}/>
                            <Route path="/winners" render={() => <div className="wrapper"><Winners/></div>}/>
                            <Route path="*" render={() =>
                                <React.Fragment>
                                    <div className="wrapper home">
                                        <img src={Logo} className={`main-logo ${nextSignUpStep || nextLoginStep ? "sign-up-second-step" : choice}`} alt="logo"/>
                                        {
                                            choice === "login" &&
                                            <React.Fragment>
                                                <input className="main-input" value={phone} placeholder="شماره | مثال: 09123456789" type="number" onChange={(event) => this.setPhone(event.target.value.trim())}/>
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
                                                <input className="main-input" value={name} placeholder="نام و نام خانوادگی" maxLength="32" type="name"
                                                       onChange={(event) => this.setName(event.target.value.toLowerCase())}/>
                                                <input className="main-input" value={phone} placeholder="شماره | مثال: 09123456789" type="number" onChange={(event) => this.setPhone(event.target.value.trim())}/>
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
                                </React.Fragment>
                            }/>
                        </Switch>
                }
            </React.Fragment>
        )
    }
}

export default App
