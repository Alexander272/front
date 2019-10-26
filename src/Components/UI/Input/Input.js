import React from 'react'
import classes from './Input.css'
import Button from '../Button/Button'

function isInValid({valid, touched, shouldValidate}) {
    return !valid && shouldValidate && touched
}

const Input = props => {
    const inputType = props.type || 'text'
    const cls = [classes.Input]
    const htmlFor = `${inputType}-${Math.round(Math.random()*1000)/1000}`

    if (isInValid(props)) {
        cls.push(classes.inValid)
    }

    return(
        <div className = {cls.join(' ')}>
            <label htmlFor = {htmlFor} >{props.label}</label>
            <input 
                name = {htmlFor}
                type = {inputType} 
                id = {htmlFor} 
                value = {props.value} 
                onChange = {props.onChange}
                required
            />
            {props.isButtonNeed ? <Button type = "primary" onClick = {props.onClick} >Загрузить</Button> : null}
            {isInValid(props) ? <span>{props.errorMessage || 'Введите верное значение'}</span> : null}
        </div>
    )
}

export default Input