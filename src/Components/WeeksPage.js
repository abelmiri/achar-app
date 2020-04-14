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
        this.bookWrapper = [React.createRef()]
    }

    componentDidMount()
    {
        const {token} = this.props.user
        axios.get("https://restful.achar.tv/week/", {headers: token ? {"Authorization": `${token}`} : null})
            .then((res) =>
            {
                let weeks = res.data.reduce((sum, num) => ([...sum, {...num, selected: false}]), [])
                this.setState({...this.state, weeks, loading: false}, () => setTimeout(this.selectDefault, 500))
            })
            .catch((err) =>
            {
                console.log(" %cERROR ", "color: orange; font-size:12px; font-family: 'Helvetica', consolas, sans-serif; font-weight:900;", err.response)
                this.setState({...this.state, loading: false})
            })
    }

    selectDefault = () =>
    {
        let {weeks} = this.state
        let modifiedWeeks = weeks.map((w, i) => i === 0 ? {...w, selected: true} : w)
        this.setState({...this.state, weeks: modifiedWeeks})
    }

    weekClick = (weekIndex) =>
    {
        let {weeks} = this.state
        let modifiedWeeks = weeks.map((w, i) => i === weekIndex ? {...w, selected: !weeks[weekIndex].selected} : w)
        this.setState({...this.state, weeks: modifiedWeeks})
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
                    weeks.map((w, i) =>
                        <div key={w._id} className="week-element" onClick={() => this.weekClick(i)} style={{"marginBottom": `${w.selected ? this.bookWrapper[i].scrollHeight + 25 : 25}px`}}>
                            <div>
                                {w.name}
                            </div>
                            <div className="week-element-date">
                                {new Date(w.start_date).toLocaleDateString("fa-ir")}
                                &nbsp; تا &nbsp;
                                {new Date(w.end_date).toLocaleDateString("fa-ir")}
                            </div>
                            <div>
                                <ArrowSvg className={`week-element-arrow-svg ${w.selected && "selected"}`}/>
                            </div>
                            <div className="books-wrapper" ref={e => this.bookWrapper[i] = e}
                                 style={{"height": `${w.selected ? this.bookWrapper[i].scrollHeight : 0}px`}}>
                                {
                                    w.books.map(b =>
                                        <a key={b._id} className="book-element" href={`https://docs.google.com/viewerng/viewer?url=https://restful.achar.tv${b.file}`}>
                                            <img alt="book" src={"https://restful.achar.tv" + b.picture} className="book-element-picture"/>
                                            <div>
                                                <div className="book-element-name">{b.name}</div>
                                                <div className="book-element-description">
                                                    {b.description ? b.description : "طراحان سایت و اپلیکیشن هنگام طراحی قالب سایت معمولا با این موضوع رو برو هستند."}
                                                </div>
                                            </div>
                                        </a>,
                                    )
                                }
                            </div>
                        </div>)
                }
            </div>
        )
    }
}

export default WeeksPage