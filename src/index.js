import React from "react"
import ReactDOM from "react-dom"
import "./Styles/index.scss"
import App from "./App"
import {BrowserRouter, withRouter} from "react-router-dom"
import serviceWorker from "./serviceWorker"

const WrappedApp = withRouter(App)

ReactDOM.render(<BrowserRouter><WrappedApp/></BrowserRouter>, document.getElementById("root"))

serviceWorker()