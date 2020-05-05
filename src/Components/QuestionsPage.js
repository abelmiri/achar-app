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
            late: false,
            questionAnswer: null,
            error: false,
        }
    }

    componentDidMount()
    {
        setTimeout(() => window.scroll({top: 0}), 100)
        const {bookId} = this.props
        const {token} = this.props.user
        axios.get(`https://restful.ketabekhoob.ir/question/${bookId}`, {headers: token ? {"Authorization": `${token}`} : null})
            .then((res) =>
            {
                res.data.questions && res.data.questions.length > 0 && res.data.questions[0].user_answer ?
                    this.setState({...this.state, data: res.data, loading: false, userAnswer: res.data.questions[0].user_answer}, () => setTimeout(this.selectDefault, 250)) :
                    this.setState({...this.state, data: res.data, loading: false}, () => setTimeout(this.selectDefault, 250))
            })
            .catch((err) =>
            {
                console.log(" %cERROR ", "color: orange; font-size:12px; font-family: 'Helvetica', consolas, sans-serif; font-weight:900;", err)
                this.setState({...this.state, loading: false, error: true})
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
        const {data, level, userAnswer, questionAnswer} = this.state
        const {bookId, user} = this.props
        const {token} = user

        if (data.questions_count === level + 1)
        {
            if (data.questions[level].user_answer || questionAnswer) this.setState({...this.state, redirect: true})
            else
            {
                this.setState({...this.state, qLoading: true}, () =>
                {
                    axios.post(`https://restful.ketabekhoob.ir/answer/`, {user_answer: userAnswer, question_id: qId}, {headers: token ? {"Authorization": `${token}`} : null})
                        .then((res) =>
                        {
                            axios.post(`https://restful.ketabekhoob.ir/lottery/`, {book_id: data.book._id}, {headers: token ? {"Authorization": `${token}`} : null})
                                .then((ans) =>
                                    ans.status === 200 ?
                                        this.setState({...this.state, questionAnswer: res.data, allCorrect: true, late: false})
                                        :
                                        this.setState({...this.state, questionAnswer: res.data, allCorrect: true, late: true}),
                                )
                                .catch(() => this.setState({...this.state, questionAnswer: res.data, allCorrect: false}))
                            setTimeout(() =>
                            {
                                axios.get(`https://restful.ketabekhoob.ir/question/${bookId}`, {headers: token ? {"Authorization": `${token}`} : null})
                                    .then((res) =>
                                    {
                                        res.data.questions && res.data.questions.length > 0 &&
                                        this.setState({...this.state, data: res.data, loading: false, qLoading: false})
                                    })
                                    .catch((err) =>
                                    {
                                        console.log(" %cERROR ", "color: orange; font-size:12px; font-family: 'Helvetica', consolas, sans-serif; font-weight:900;", err)
                                        this.setState({...this.state, loading: false, error: true})
                                    })
                            }, 500)
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
            if (data.questions[level].user_answer && data.questions[level + 1].user_answer) this.setState({...this.state, userAnswer: data.questions[level + 1].user_answer, level: level + 1},
                () => this.adjustHeights())
            else if (data.questions[level].user_answer && !data.questions[level + 1].user_answer) this.setState({...this.state, userAnswer: 0, level: level + 1},
                () => this.adjustHeights())
            else if (!data.questions[level].user_answer && data.questions[level + 1].user_answer) this.setState({...this.state, qLoading: true}, () =>
                axios.post(`https://restful.ketabekhoob.ir/answer/`, {user_answer: userAnswer, question_id: qId}, {headers: token ? {"Authorization": `${token}`} : null})
                    .then(() => this.setState({...this.state, questionAnswer: null, qLoading: false, userAnswer: data.questions[level + 1].user_answer, level: level + 1}, () => this.adjustHeights()))
                    .catch((err) =>
                    {
                        console.log(" %cERROR ", "color: orange; font-size:12px; font-family: 'Helvetica', consolas, sans-serif; font-weight:900;", err)
                        this.setState({...this.state, qLoading: false})
                    }))
            else if (!data.questions[level].user_answer && !data.questions[level + 1].user_answer) this.setState({...this.state, qLoading: true}, () =>
                axios.post(`https://restful.ketabekhoob.ir/answer/`, {user_answer: userAnswer, question_id: qId}, {headers: token ? {"Authorization": `${token}`} : null})
                    .then(() => this.setState({...this.state, questionAnswer: null, qLoading: false, userAnswer: 0, level: level + 1}, () => this.adjustHeights()))
                    .catch((err) =>
                    {
                        console.log(" %cERROR ", "color: orange; font-size:12px; font-family: 'Helvetica', consolas, sans-serif; font-weight:900;", err)
                        this.setState({...this.state, qLoading: false})
                    }))
        }
    }

    backToStart = () =>
    {
        const {data} = this.state
        this.setState({...this.state, loading: false, userAnswer: data.questions[0].user_answer, level: 0}, () => this.adjustHeights())
    }

    adjustHeights = () =>
    {
        setTimeout(() => this.bookWrapper ? this.bookWrapper.style.height = "0px" : null, 50)
        setTimeout(() =>
        {
            if (this.bookWrapper && this.weekElement)
            {
                this.weekElement.style.marginBottom = (this.bookWrapper.scrollHeight + 25) + "px"
                this.bookWrapper.style.height = this.bookWrapper.scrollHeight + "px"
            }
        }, 300)
    }

    render()
    {
        const {loading, data, selected, level, userAnswer, questionAnswer, redirect, qLoading, allCorrect, late, error} = this.state
        if (loading) return <div className="loading-container"><MoonLoader size="70px" color="#707070"/></div>
        else if (data.questions && data.questions.length > 0) return (
            <div className="questions-wrapper">
                <div className="week-element" ref={e => this.weekElement = e} style={{"marginBottom": `${selected ? this.bookWrapper.scrollHeight + 25 : 25}px`}}>
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
                            <div className="question">{`${level + 1}. ${data.questions[level].question_text}`}</div>
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
                        <div className="questions-buttons-container">
                            <Material className={`questions-button next ${(userAnswer === 0 || qLoading) && "inactive"}`}
                                      onClick={() => (userAnswer !== 0 && !qLoading) && this.nextQuestion(data.questions[level]._id)}>
                                {data.questions_count === level + 1 ? questionAnswer ? "صفحه اصلی" : "پایان آزمون" : "سوال بعدی"}
                            </Material>
                            {
                                data.questions_count === level + 1 && (questionAnswer || data.questions[level].user_answer) &&
                                <Material className="questions-button previous"
                                          onClick={() => this.backToStart()}>
                                    نمایش پاسخنامه
                                </Material>
                            }
                        </div>
                    </div>
                </div>
                {/*{*/}
                {/*    questionAnswer &&*/}
                {/*    <div className={questionAnswer.is_correct ? "correct-answer" : "wrong-answer"}>*/}
                {/*        {*/}
                {/*            `${questionAnswer.is_correct ? "آفرین! پاسخ شما صحیح بود" : `متاسفانه پاسخ صحیح گزینه ${questionAnswer.correct_answer} بود`}`*/}
                {/*        }*/}
                {/*    </div>*/}
                {/*}*/}
                {
                    data.questions[data.questions_count - 1].user_answer &&
                    <div className={data.questions[level].correct_answer === data.questions[level].user_answer ? "correct-answer" : "wrong-answer"}>
                        {
                            `${data.questions[level].correct_answer === data.questions[level].user_answer ? "آفرین! پاسخ شما صحیح بود" : `متاسفانه پاسخ صحیح گزینه ${data.questions[level].correct_answer} بود`}`
                        }
                    </div>
                }
                {
                    data.questions_count === level + 1 && data.questions[level].user_answer &&
                    <React.Fragment>
                        <hr/>
                        <div className="correct-answer">
                            {
                                `شما به ${data.corrects_count} سوال از ${data.questions_count} سوال پاسخ صحیح داده‌اید`
                            }
                        </div>
                    </React.Fragment>
                }
                {
                    allCorrect &&
                    <React.Fragment>
                        <hr/>
                        <div className="correct-answer">
                            {
                                late ?
                                    "تبریک! تمام پاسخ های شما صحیح بود"
                                    :
                                    "تبریک! تمام پاسخ های شما صحیح بود و در قرعه‌کشی شرکت خواهید کرد"
                            }
                        </div>
                    </React.Fragment>
                }
                {
                    redirect &&
                    <Redirect to="/"/>
                }
            </div>
        )
        else return <div className="loading-container">{error ? "خطا در برقرای ارتباط" : "سوالی یافت نشد"}</div>
    }
}

export default QuestionsPage