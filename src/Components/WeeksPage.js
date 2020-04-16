import React, {PureComponent} from "react"
import axios from "axios"
import {MoonLoader} from "react-spinners"
import ArrowSvg from "../Media/Svgs/arrow_svg"
import Material from "./Material"
import {Link} from "react-router-dom"

class WeeksPage extends PureComponent
{
    bookURL = ""
    bookId = ""

    constructor(props)
    {
        super(props)
        this.state = {
            loading: true,
            bookLoading: false,
            iframeLoaded: false,
            weeksLoading: false,
            bookModal: false,
            weeks: [],
        }
        this.bookWrapper = [React.createRef()]
        this.page = 2
        this.activeScrollHeight = 0
    }

    componentDidMount()
    {
        setTimeout(() => window.scroll({top: 0}), 100)

        const {token} = this.props.user

        axios.get("https://restful.achar.tv/week/", {headers: token ? {"Authorization": `${token}`} : null})
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

    componentDidUpdate(prevProps, prevState, snapshot)
    {
        const {iframeLoaded} = this.state
        if (prevProps.location !== this.props.location && iframeLoaded) this.setState({...this.state, bookModal: false, bookLoading: false, iframeLoaded: false})
    }

    onPopState = () =>
    {
        const {bookLoading, iframeLoaded} = this.state
        if (bookLoading || iframeLoaded) this.setState({...this.state, bookModal: false, bookLoading: false, iframeLoaded: false})
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
                    axios.get(`https://restful.achar.tv/week/?limit=10&page=${this.page}`, {headers: token ? {"Authorization": `${token}`} : null})
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

    showBookModal = (e, url, id) =>
    {
        e.stopPropagation()
        this.setState({...this.state, bookModal: true}, () =>
        {
            this.bookURL = url
            this.bookId = id
        })
    }

    hideBookModal = (e) =>
    {
        e.preventDefault()
        this.setState({...this.state, bookModal: false, bookLoading: false, iframeLoaded: false})
    }

    bookLoading = (e) =>
    {
        e.stopPropagation()
        this.setState({...this.state, bookLoading: true}, () =>
            window.history.pushState("", "", "/show-book"),
        )
    }

    iframeLoad = () =>
    {
        this.setState({...this.state, iframeLoaded: true, bookLoading: false, bookModal: false})
    }

    render()
    {
        const {loading, bookLoading, iframeLoaded, weeks, bookModal, weeksLoading} = this.state
        if (loading) return (
            <div className="loading-container">
                <MoonLoader size="70px" color="#303030"/>
            </div>
        )
        else return (
            <div className="weeks-wrapper">
                {
                    (iframeLoaded || bookLoading) &&
                    <div key={this.bookURL} className={iframeLoaded ? "iframe-container" : "iframe-unloaded"}>
                        <iframe title="book" className="book-iframe" onLoad={() => this.iframeLoad()} src={`${this.bookURL}&embedded=true`}/>
                    </div>
                }
                {bookLoading && <div className="book-loading"><MoonLoader size="70px" color="#66FFCC"/></div>}
                {
                    bookModal &&
                    <div className="modal-container" onClick={(e) => this.hideBookModal(e)}>
                        <div className="modal-body" onClick={(e) => e.stopPropagation()}>
                            <Material className={`main-button`} onClick={(e) => this.bookLoading(e)}>
                                مشاهده‌ی کتاب
                            </Material>
                            <Link to={`/questions/${this.bookId}`}>
                                <Material className={`main-button`} onClick={() => null}>
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
                                    w.books.map(b =>
                                        <Material key={b._id} className="book-element" backgroundColor="rgba(102,255,204,.4)"
                                                  onClick={(e) => this.showBookModal(e, `https://docs.google.com/viewerng/viewer?url=https://restful.achar.tv${b.file}`, b._id)}>
                                            <img style={{"flexGrow": "1"}} alt="book" src={"https://restful.achar.tv" + b.picture} className="book-element-picture"/>
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
                {weeksLoading && <div><MoonLoader size="30px" color="#66FFCC"/></div>}
            </div>
        )
    }
}

export default WeeksPage