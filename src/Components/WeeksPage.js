import React, {PureComponent} from "react"
import axios from "axios"
import {MoonLoader} from "react-spinners"
import ArrowSvg from "../Media/Svgs/arrow_svg"

class WeeksPage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            loading: true,
            weeks: [],
        }
    }

    componentDidMount()
    {
        const {token} = this.props.user
        axios.get("https://restful.achar.tv/week/", {headers: token ? {"Authorization": `${token}`} : null})
            .then((res) =>
            {
                this.setState({...this.state, weeks: res.data, loading: false})
            })
            .catch((err) =>
            {
                console.log(" %cERROR ", "color: orange; font-size:12px; font-family: 'Helvetica',consolas,sans-serif; font-weight:900;", err.response)
                this.setState({...this.state, loading: false})
            })
    }

    render()
    {
        const {loading, weeks} = this.state
        if (loading) return (
            <div className="loading-container">
                <MoonLoader size="70px" color="#303030"/>
            </div>
        )
        else return (
            <div className="weeks-wrapper">
                {
                    weeks.map((w) =>
                        <div key={w._id} className="week-element">
                            {console.log(w)}
                            <div>
                                {w.name}
                            </div>
                            <div className="week-element-date">
                                {new Date(w.start_date).toLocaleDateString("fa-ir")}
                                &nbsp; تا &nbsp;
                                {new Date(w.end_date).toLocaleDateString("fa-ir")}
                            </div>
                            <div>
                                <ArrowSvg className="week-element-arrow-svg"/>
                            </div>
                        </div>)
                }
            </div>
        )
    }
}

export default WeeksPage