import React from 'react';
import classes from './Button.css'

const Button = props => {
    const cls = [classes.Button, classes[props.type]]

    return (
        <button
            onClick = {props.onClick}
            className = {cls.join(' ')}
            
        >{props.children}</button>
    )
}
// disabled = {props.disabled}

export default Button