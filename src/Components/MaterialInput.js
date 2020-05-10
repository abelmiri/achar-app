import React, {Component} from "react"
import * as PropTypes from "prop-types"

class MaterialInput extends Component
{
    static propTypes = {
        className: PropTypes.string.isRequired,
        backgroundColor: PropTypes.string.isRequired,
        label: PropTypes.any.isRequired,
        getValue: PropTypes.func.isRequired,
        type: PropTypes.string,
        maxLength: PropTypes.number,
        isTextArea: PropTypes.bool,
        disabled: PropTypes.bool,
        defaultValue: PropTypes.string,
        borderColor: PropTypes.string,
        name: PropTypes.string,
    }

    constructor(props)
    {
        super(props)
        this.state = {
            value: "",
            focused: false,
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleFocus = this.handleFocus.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    componentDidMount()
    {
        const {defaultValue} = this.props
        if (defaultValue)
        {
            this.setState({...this.state, value: defaultValue})
        }
    }

    handleChange(e)
    {
        const event = {...e}
        const value = event.target.value
        const {maxLength} = this.props
        if ((!maxLength) || (maxLength && value.length <= maxLength))
        {
            this.setState({...this.state, value}, () =>
                this.props.getValue(event)
            )
        }
    }

    handleFocus()
    {
        this.setState({...this.state, focused: true})
    }

    handleBlur()
    {
        this.setState({...this.state, focused: false})
    }

    handleKeyDown(e)
    {
        this.props.onKeyDown && this.props.onKeyDown(e)
    }

    handleClick()
    {
        this.textRef.focus()
    }

    render()
    {
        const {className, isTextArea, maxLength, borderColor, type, label, backgroundColor, name, disabled} = this.props
        const {focused, value} = this.state

        return (
            <div className={className ? className + " material-input" : "material-input"}>
                {
                    isTextArea ?
                        <textarea maxLength={maxLength}
                                  name={name}
                                  ref={e => this.textRef = e}
                                  className="material-input-textarea"
                                  value={value}
                                  onChange={this.handleChange}
                                  onFocus={this.handleFocus}
                                  onKeyDown={this.handleKeyDown}
                                  onBlur={this.handleBlur}
                                  style={borderColor ? {borderColor} : {}}
                                  disabled={disabled}
                        />
                        :
                        <input type={type ? type : "text"}
                               maxLength={maxLength}
                               name={name}
                               ref={e => this.textRef = e}
                               className="material-input-text"
                               value={value}
                               onChange={this.handleChange}
                               onFocus={this.handleFocus}
                               onKeyDown={this.handleKeyDown}
                               onBlur={this.handleBlur}
                               style={borderColor ? {borderColor} : {}}
                               disabled={disabled}
                        />
                }

                <label className={focused || value.length > 0 ? "material-input-label-out" : "material-input-label"}
                       style={{backgroundColor: backgroundColor ? backgroundColor : "white"}}
                       onClick={this.handleClick}>
                    {label}
                </label>
            </div>
        )
    }
}

export default MaterialInput