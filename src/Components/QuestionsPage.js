import React, {PureComponent} from "react"
import axios from "axios"
import {MoonLoader} from "react-spinners"
import Material from "./Material"
import ArrowSvg from "../Media/Svgs/arrow_svg"
import {Redirect} from "react-router-dom"

class QuestionsPage extends PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {
            loading: true,
            selected: false,
            data: {},
            level: 0,
            userAnswer: 0,
            redirect: false,
            allCorrect: false,
            questionAnswer: null,
        }
    }

    componentDidMount()
    {
        setTimeout(() => window.scroll({top: 0}), 100)
        const {bookId} = this.props
        const {token} = this.props.user
        axios.get(`https://restful.achar.tv/question/${bookId}`, {headers: token ? {"Authorization": `${token}`} : null})
            .then((res) =>
            {
                res.data.questions[0].user_answer ?
                    this.setState({...this.state, data: res.data, loading: false, userAnswer: res.data.questions[0].user_answer}, () => setTimeout(this.selectDefault, 250)) :
                    this.setState({...this.state, data: res.data, loading: false}, () => setTimeout(this.selectDefault, 250))
            })
            .catch((err) =>
            {
                console.log(" %cERROR ", "color: orange; font-size:12px; font-family: 'Helvetica', consolas, sans-serif; font-weight:900;", err.response)
                this.setState({...this.state, loading: false})
            })
    }

    selectDefault = () => this.setState({...this.state, selected: true})

    selectUserAnswer = (answer, qIndex) =>
    {
        const {data} = this.state
        data.questions[qIndex].user_answer ?
            this.setState({...this.state, userAnswer: data.questions[qIndex].user_answer}) :
            this.setState({...this.state, userAnswer: answer})
    }

    nextQuestion = (qId) =>
    {
        const {data, level, userAnswer} = this.state
        const {token} = this.props.user

        if (data.questions_count === level + 1)
        {
            if (data.questions[level].user_answer) this.setState({...this.state, redirect: true})
            else
            {
                this.setState({...this.state, qLoading: true}, () =>
                {
                    axios.post(`https://restful.achar.tv/answer/`, {user_answer: userAnswer, question_id: qId}, {headers: token ? {"Authorization": `${token}`} : null})
                        .then((res) =>
                        {
                            this.setState({...this.state, questionAnswer: res.data})

                            axios.post(`https://restful.achar.tv/lottery/`, {book_id: data.book._id}, {headers: token ? {"Authorization": `${token}`} : null})
                                .then((res) =>
                                {
                                    res.statusCode === 200 && this.setState({...this.state, allCorrect: true})
                                })
                                .catch(() => null)

                            setTimeout(() => this.setState({...this.state, redirect: true, questionAnswer: null, qLoading: false, userAnswer: 0}), 5000)
                        })
                        .catch((err) =>
                        {
                            console.log(" %cERROR ", "color: orange; font-size:12px; font-family: 'Helvetica', consolas, sans-serif; font-weight:900;", err)
                            this.setState({...this.state, qLoading: false})
                        })
                })
            }

        }
        else
        {
            if (data.questions[level].user_answer && data.questions[level + 1].user_answer) this.setState({...this.state, userAnswer: data.questions[level + 1].user_answer, level: level + 1})
            else if (data.questions[level].user_answer && !data.questions[level + 1].user_answer) this.setState({...this.state, userAnswer: 0, level: level + 1})
            else if (!data.questions[level].user_answer && data.questions[level + 1].user_answer) this.setState({...this.state, qLoading: true}, () =>
                axios.post(`https://restful.achar.tv/answer/`, {user_answer: userAnswer, question_id: qId}, {headers: token ? {"Authorization": `${token}`} : null})
                    .then((res) =>
                    {
                        this.setState({...this.state, questionAnswer: res.data})

                        setTimeout(() =>
                        {
                            this.setState({...this.state, questionAnswer: null, qLoading: false, userAnswer: data.questions[level + 1].user_answer, level: level + 1})
                        }, 3000)
                    })
                    .catch((err) =>
                    {
                        console.log(" %cERROR ", "color: orange; font-size:12px; font-family: 'Helvetica', consolas, sans-serif; font-weight:900;", err)
                        this.setState({...this.state, qLoading: false})
                    }))
            else if (!data.questions[level].user_answer && !data.questions[level + 1].user_answer) this.setState({...this.state, qLoading: true}, () =>
                axios.post(`https://restful.achar.tv/answer/`, {user_answer: userAnswer, question_id: qId}, {headers: token ? {"Authorization": `${token}`} : null})
                    .then((res) =>
                    {
                        this.setState({...this.state, questionAnswer: res.data})

                        setTimeout(() =>
                        {
                            this.setState({...this.state, questionAnswer: null, qLoading: false, userAnswer: 0, level: level + 1})
                        }, 5000)
                    })
                    .catch((err) =>
                    {
                        console.log(" %cERROR ", "color: orange; font-size:12px; font-family: 'Helvetica', consolas, sans-serif; font-weight:900;", err)
                        this.setState({...this.state, qLoading: false})
                    }))
        }
    }

    render()
    {
        const {loading, data, selected, level, userAnswer, questionAnswer, redirect, qLoading, allCorrect} = this.state
        if (loading) return (
            <div className="loading-container">
                <MoonLoader size="70px" color="#303030"/>
            </div>
        )
        else if (data.questions.length > 0) return (
            <div className="questions-wrapper">
                <div className="week-element" style={{"marginBottom": `${selected ? this.bookWrapper.scrollHeight + 25 : 25}px`}}>
                    <Material className="week-element-material">
                        <div>
                            آزمون
                        </div>
                        <div className="week-element-date">
                            &nbsp;
                            {data.book.name}
                            &nbsp;
                        </div>
                        <div>
                            <ArrowSvg className={`week-element-arrow-svg ${selected && "selected"}`}/>
                        </div>
                    </Material>
                    <div className="books-wrapper shadow" ref={e => this.bookWrapper = e} style={{"height": `${selected ? this.bookWrapper.scrollHeight : 0}px`}}>
                        <div className="questions-container">
                            <div className="question">{`${level + 1} _ ${data.questions[level].question_text}`}</div>
                            <label className="answer container">
                                {`${data.questions[level].first_answer}`}
                                <input type="radio" name="radio" checked={userAnswer === 1} onChange={() => this.selectUserAnswer(1, level)}/>
                                <span className="checkmark"/>
                            </label>
                            <label className="answer container">
                                {`${data.questions[level].second_answer}`}
                                <input type="radio" name="radio" checked={userAnswer === 2} onChange={() => this.selectUserAnswer(2, level)}/>
                                <span className="checkmark"/>
                            </label>
                            <label className="answer container">
                                {`${data.questions[level].third_answer}`}
                                <input type="radio" name="radio" checked={userAnswer === 3} onChange={() => this.selectUserAnswer(3, level)}/>
                                <span className="checkmark"/>
                            </label>
                            <label className="answer container">
                                {`${data.questions[level].forth_answer}`}
                                <input type="radio" name="radio" checked={userAnswer === 4} onChange={() => this.selectUserAnswer(4, level)}/>
                                <span className="checkmark"/>
                            </label>
                        </div>
                        <Material className={`next-button ${(userAnswer === 0 || qLoading) && "inactive"}`}
                                  onClick={() => (userAnswer !== 0 && !qLoading) && this.nextQuestion(data.questions[level]._id)}>
                            {data.questions_count === level + 1 ? "پایان آزمون" : "سوال بعدی"}
                        </Material>
                    </div>
                </div>
                {
                    questionAnswer &&
                    <div className={questionAnswer.is_correct ? "correct-answer" : "wrong-answer"}>
                        {
                            `${questionAnswer.is_correct ? "آفرین! پاسخ شما صحیح بود" : `متاسفانه پاسخ صحیح گزینه ${questionAnswer.correct_answer} بود`}`
                        }
                    </div>
                }
                {
                    allCorrect &&
                    <React.Fragment>
                        <hr/>
                        <div className="correct-answer">
                            تبریک! تمام پاسخ های شما صحیح بود و در قرعه‌کشی شرکت خواهید کرد
                        </div>
                    </React.Fragment>
                }
                {
                    redirect &&
                    <Redirect to="/"/>
                }
            </div>
        )
        else return (
                <div className="loading-container">
                    متأسفانه سوالی طرح نشده است
                </div>
            )
    }
}

export default QuestionsPage