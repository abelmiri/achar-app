import React, {PureComponent} from "react"
import axios from "axios"
import {MoonLoader} from "react-spinners"

class SummaryPage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            isLoading: true,
            book: null,
        }
    }

    componentDidMount()
    {
        window.scroll({top: 0})
        const {bookId, user} = this.props
        const {token} = user
        axios.get(`https://restful.ketabekhoob.ir/book/${bookId}`, {headers: token ? {"Authorization": `${token}`} : null})
            .then((res) => this.setState({...this.state, book: {...res.data}, isLoading: false}))
            .catch((err) =>
            {
                console.log(" %cERROR ", "color: orange; font-size:12px; font-family: 'Helvetica', consolas, sans-serif; font-weight:900;", err.response)
                this.setState({...this.state, isLoading: false})
            })
    }

    render()
    {
        const {isLoading, book} = this.state
        if (isLoading) return <div className="loading-container"><MoonLoader size="70px" color="#707070"/></div>
        else if (book)
            return (
                <div className="summary-cont">
                    <div className="summary-cont-title">خلاصه کتاب {book.name}:</div>
                    {book?.summary}
                </div>
            )
        else return <div className="loading-container">خطا در برقراری ارتباط!</div>
    }
}

export default SummaryPage