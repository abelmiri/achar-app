import React, {PureComponent} from "react"
import axios from "axios"
import {MoonLoader} from "react-spinners"
import ArrowSvg from "../Media/Svgs/arrow_svg"
import Material from "./Material"
import {Link} from "react-router-dom"
import ImageShow from "./ImageShow"

class WeeksPage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            loading: true,
            weeksLoading: false,
            bookModal: false,
            weeks: [],
            bookId: "",
        }
        this.bookWrapper = [React.createRef()]
        this.page = 2
        this.activeScrollHeight = 0
    }

    componentDidMount()
    {
        setTimeout(() => window.scroll({top: 0}), 100)

        const {token} = this.props.user

        axios.get("https://restful.ketabekhoob.ir/week/", {headers: token ? {"Authorization": `${token}`} : null})
            .then((res) =>
            {
                let weeks = res.data.reduce((sum, num) => ([...sum, {...num, selected: false}]), [])
                this.setState({...this.state, weeks, loading: false}, () => setTimeout(this.selectDefault, 250))
            })
            .catch((err) =>
            {
                console.log(" %cERROR ", "color: orange; font-size:12px; font-family: 'Helvetica', consolas, sans-serif; font-weight:900;", err.response)
                this.setState({...this.state, loading: false})
            })

        window.addEventListener("popstate", this.onPopState)
        document.addEventListener("scroll", this.onScroll)
    }

    componentWillUnmount()
    {
        window.removeEventListener("popstate", this.onPopState)
        document.removeEventListener("scroll", this.onScroll)
    }

    onScroll = () =>
    {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() =>
        {
            const {weeks} = this.state
            const {token} = this.props.user
            const scrollHeight = document.body ? document.body.scrollHeight : 0
            if (weeks.length > 9 && window.innerHeight + window.scrollY >= scrollHeight - 200 && scrollHeight > this.activeScrollHeight)
            {
                this.setState({...this.state, weeksLoading: true}, () =>
                {
                    this.activeScrollHeight = scrollHeight
                    axios.get(`https://restful.ketabekhoob.ir/week/?limit=10&page=${this.page}`, {headers: token ? {"Authorization": `${token}`} : null})
                        .then((res) =>
                        {
                            if (res.data.length > 0)
                            {
                                this.page += 1
                                let addedWeeks = weeks.concat(res.data)
                                this.setState({...this.state, weeksLoading: false, weeks: addedWeeks})
                            }
                        })
                })
            }
        }, 50)
    }

    selectDefault = () =>
    {
        let {weeks} = this.state
        let modifiedWeeks = [...weeks]
        modifiedWeeks[0].selected = true
        this.setState({...this.state, weeks: modifiedWeeks})
    }

    weekClick = (weekIndex) =>
    {
        let {weeks} = this.state
        let modifiedWeeks = weeks.map((w, i) => i === weekIndex ? {...w, selected: !weeks[weekIndex].selected} : w)
        this.setState({...this.state, weeks: modifiedWeeks})
    }

    showBookModal = (e, id) =>
    {
        e.stopPropagation()
        this.setState({...this.state, bookModal: true, bookId: id})
    }

    hideBookModal = (e) =>
    {
        e.preventDefault()
        this.setState({...this.state, bookModal: false})
    }

    render()
    {
        const {loading, weeks, bookModal, weeksLoading, bookId} = this.state
        if (loading) return <div className="loading-container"><MoonLoader size="70px" color="#707070"/></div>
        else return (
            <div className="weeks-wrapper">
                {
                    bookModal &&
                    <div className="modal-container" onClick={(e) => this.hideBookModal(e)}>
                        <div className="modal-body" onClick={(e) => e.stopPropagation()}>
                            <Link to={`/summary/${bookId}`}>
                                <Material className="main-button">
                                    گزیده‌ای از کتاب
                                </Material>
                            </Link>
                            <Link to={`/questions/${bookId}`}>
                                <Material className="main-button">
                                    شرکت در آزمون
                                </Material>
                            </Link>
                        </div>
                    </div>
                }
                {
                    weeks.map((w, i) =>
                        <div key={w._id} className="week-element" onClick={() => this.weekClick(i)} style={{"marginBottom": `${w.selected ? this.bookWrapper[i].scrollHeight + 25 : 25}px`}}>
                            <Material className="week-element-material">
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
                            </Material>
                            <div className="books-wrapper" ref={e => this.bookWrapper[i] = e}
                                 style={{"height": `${w.selected ? this.bookWrapper[i].scrollHeight : 0}px`}}>
                                {
                                    w.books && w.books.map(b =>
                                        <Material key={b._id} className="book-element" backgroundColor="rgba(0,168,19,0.3)" onClick={(e) => this.showBookModal(e, b._id)}>
                                            <ImageShow style={{"flexGrow": "1"}} alt="book" src={"https://restful.ketabekhoob.ir" + b.picture} className="book-element-picture"/>
                                            <div className="book-element-details">
                                                <div className="book-element-name">
                                                    {b.name}
                                                </div>
                                                <div className="book-element-description">
                                                    {b.description ? b.description : "توضیحاتی ارائه نشده!"}
                                                </div>
                                            </div>
                                            <div className="book-element-date">
                                                {new Date(b.created_date).toLocaleDateString("fa-ir")}
                                            </div>
                                        </Material>,
                                    )
                                }
                            </div>
                        </div>,
                    )
                }
                {weeksLoading && <div className="weeks-loading"><MoonLoader size="30px" color="#66FFCC"/></div>}
            </div>
        )
    }
}

export default WeeksPage