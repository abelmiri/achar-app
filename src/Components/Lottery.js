import React, {PureComponent} from "react"
import MaterialInput from "./MaterialInput"
import Material from "./Material"
import CheckSvg from "../Media/Svgs/CheckSvg"
import numberCorrection from "../Helpers/numberCorrection"
import axios from "axios"
import {MoonLoader} from "react-spinners"

class Lottery extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            date: "",
            loading: false,
            users: [],
            error: false,
            notFound: false,
        }
    }

    setDate = (e) =>
    {
        this.setState({...this.state, date: numberCorrection(e.target.value.trim().replace(/\/0/g, "/"))})
    }

    lottery = () =>
    {
        this.setState({...this.state, loading: true, users: [], error: false, notFound: false}, () =>
        {
            const {token} = this.props.user
            const {date} = this.state
            axios.get(`https://restful.ketabekhoob.ir/lottery?create_persian_date=${date}`, {headers: {"Authorization": `${token}`}})
                .then((res) =>
                {
                    this.setState({...this.state, users: res.data, loading: false})
                })
                .catch(err =>
                {
                    console.error(err.response)
                    if (err?.response?.status === 404) this.setState({...this.state, notFound: true, loading: false})
                    else this.setState({...this.state, error: true, loading: false})
                })
        })
    }

    submitOnEnter = (e) => e.keyCode === 13 && this.lottery()

    close = () => this.setState({...this.state, loading: false, users: []})

    render()
    {
        const {date, loading, error, notFound, users} = this.state
        const split = date.split("/")
        const isValid = split.length === 3 && !isNaN(split[0]) && parseInt(split[0]) >= 1399 && !isNaN(split[1]) && parseInt(split[1]) <= 12 && parseInt(split[1]) > 0 && !isNaN(split[2]) && parseInt(split[2]) <= 31 && parseInt(split[2]) > 0

        return (
            <div className="lottery-cont">
                <div className="lottery-title"><span role="img" aria-label="">✨</span> قرعه کشی <span role="img" aria-label="">🥳</span></div>
                <MaterialInput onKeyDown={isValid ? this.submitOnEnter : null} className="lottery-input" backgroundColor="var(--background-color)" label="تاریخ | مثال: 1399/2/5" getValue={this.setDate}/>
                {notFound && <div className="lottery-err">کاربری یافت نشد! تاریخ وارد شده را چک کنید!</div>}
                {error && <div className="lottery-err">مشکلی پیش آمد! اینترنت خود را بررسی کنید!</div>}
                <Material className="lottery-sub-material" onClick={isValid ? this.lottery : null}>
                    <CheckSvg className={`lottery-sub ${isValid ? "active" : ""}`}/>
                </Material>

                {
                    ((users && users.length > 0) || loading) &&
                    <div className="lottery-loading-modal" onClick={loading ? null : this.close}>
                        {
                            loading ?
                                <MoonLoader size="70px" color="#707070"/>
                                :
                                <div className="lottery-winners" onClick={e => e.stopPropagation()}>
                                    <div className="winners-section none-box">
                                        <div className="winners-day anime">برندگان {split[2]} اردیبهشت</div>
                                        <div className="phone-direction">
                                            {users.map((user, index) => <div className={`winner-anime ${index === 0 ? "first" : index === 1 ? "second" : index === 2 ? "third" : index === 3 ? "forth" : ""}`} key={user.phone}>{user.phone}</div>)}
                                        </div>
                                    </div>
                                </div>
                        }
                    </div>
                }

            </div>
        )
    }
}

export default Lottery