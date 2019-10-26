import React from 'react'
import classes from './Table.css'

const Table = props => {
    return (
        <table className = {classes.Table}>
            <thead>
                <tr>
                    {renderTh(props.thead)}       
                </tr>
            </thead>
            <tbody>
                {renderTr(props)}
            </tbody>
        </table>
    )
}

function renderTh(thead) {
    return thead.map((item, index) => {
        return (
            <th key = {index}>{item}</th>
        )
    })
}

function renderTr(props) {
    return props.tbody.map((item, index) => {
        return (
            <tr key={index}>
                {renderTd(item, props, item.id)}
                <td className={classes.deleted} onClick = {props.deleteCompanyHundler} data-id = {item.id} >&times;</td>
            </tr>
        )
    })
}

function renderTd(item, props, id) {
    const list = []
    Object.keys(item).forEach(key => {
        if (key !== 'id') list.push(item[key])
    })
    return list.map((item, index) => {
        if (index === 1) return (
            <td key = {index}>
                <input value={item} onChange = {props.changeAddressHandler} data-id = {id} />
            </td>)
        return ( 
            <td key = {index} >{item}</td> 
        )
    })
}

export default Table