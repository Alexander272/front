import React from 'react'
import classes from './Window.css'
import Input from '../../Components/UI/Input/Input'
import Button from '../../Components/UI/Button/Button'
import axios from '../../axios/axios'
import ax from 'axios'

class Window extends React.Component {

    state = {
        isFormValid: false,
        formControls: {
            name: this.createControls(0, 'text'),
            address: this.createControls(1, 'text'),
            ogrn: this.createControls(2, 'text'),
            inn: this.createControls(3, 'text'),
            date: this.createControls(4, 'date'),
        }
    }

    createControls(number, type) {
        let validators = {
            required: true,
        }
        let errorMessage = 'Поле не может быть пустым'
        if (number === 3) {
            validators = {
                required: true,
                onlyNumber: true
            }
            errorMessage = ''
        }

        return {
            validation: {...validators},
            type: type,
            label: this.props.thead[number],
            valid: false,
            touched: false,
            value: '',
            errorMessage
        }
    }

    createControl() {
        return Object.keys(this.state.formControls).map((controlName, index) => {
            const control = this.state.formControls[controlName]
            if (control.label.toLowerCase() === 'инн') {
                return (
                    <Input
                        key = {controlName + index}
                        type = {control.type}
                        value = {control.value}
                        valid = {control.valid}
                        touched = {control.touched}
                        label = {control.label}
                        shouldValidate = {!!control.validation}
                        errorMessage = {control.errorMessage}
                        onChange = {event => this.onChangeHandler(event, controlName)}
                        isButtonNeed = {true}
                        onClick = {event => this.onLoadHandler(event)}
                    />
                )
            }
            return (
                <Input 
                    key = {controlName + index}
                    type = {control.type}
                    value = {control.value}
                    valid = {control.valid}
                    touched = {control.touched}
                    label = {control.label}
                    shouldValidate = {!!control.validation}
                    errorMessage = {control.errorMessage}
                    onChange = {event => this.onChangeHandler(event, controlName)}
                />
            )
        })
    }

    validateControl(value, validation) {
        if (!validation) {
            return true
        }

        let isValid = true

        if (validation.required) {
            isValid = value.trim() !== '' && isValid
        }

        if (validation.onlyNumber) {
            isValid = +value && isValid
        }

        return isValid
    }

    onChangeHandler = (event, controlName) => {
        const formControls = {...this.state.formControls}
        const control = {...formControls[controlName]}

        control.value = event.target.value
        control.touched = true
        control.valid = this.validateControl(control.value, control.validation)

        formControls[controlName] = control

        let isFormValid = true

        Object.keys(formControls).forEach(name => {
            isFormValid = formControls[name].valid && isFormValid
        })

        this.setState({ formControls, isFormValid })
    }

    addCompanyHandler = async event => {
        event.preventDefault()
        const formControls = {...this.state.formControls}
        let data = {}
        Object.keys(formControls).forEach(name => {
            data[name] = formControls[name].value
        })
        await axios.post('/companyList.json', data)
            .then(response => {
                data.id = response.data.name
            })
            .catch(error => console.log(error))

        this.setState({
            isFormValid: false,
            formControls: {
                name: this.createControls(0, 'text'),
                address: this.createControls(1, 'text'),
                ogrn: this.createControls(2, 'text'),
                inn: this.createControls(3, 'text'),
                date: this.createControls(4, 'date'),
            }
        })
        this.props.changeStateHandler(data)
    }

    onLoadHandler = async event => {
        event.preventDefault()
        try {
            const response = await ax.post(
                'https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party', 
                { 'query': this.state.formControls.inn.value }, 
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Token 9a6dcd7726f126ca397fedf086f2ee87ff9319f1'
                    },
                }
            )
            const formControls = this.state.formControls
            const date = new Date(response.data.suggestions[0].data.state.registration_date)
            Object.keys(formControls).forEach(name => {
                switch (name) {
                    case 'name':
                        formControls[name].value = response.data.suggestions[0].value
                        break;
                    case 'address':
                        formControls[name].value = response.data.suggestions[0].data.address.value
                        break;
                    case 'ogrn':
                        formControls[name].value = response.data.suggestions[0].data.ogrn
                        break;
                    case 'inn':
                        formControls[name].value = response.data.suggestions[0].data.inn
                        break;
                    case 'date':
                        formControls[name].value = `${date.getFullYear()}-${date.getMonth() <10 ? '0' + date.getMonth() : date.getMonth()}-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`
                        break;
                    default:
                        break;
                }
            })
            this.setState({ formControls })
        } catch (error) {
            console.log(error)
        }
    }

    render() {
        return (
            <div className = {classes.container}>
                <div className = {classes.Window}>
                    <div className = {classes.header}>
                        <span className = {classes.close} onClick = {this.props.closeWindowHandler} >&times;</span>
                        <h2>Добавить компанию</h2>
                    </div>
                    <div className = {classes.content}>
                        <form>
                            {this.createControl()}
                            <Button type="primary" onClick = {this.addCompanyHandler} disabled = {!this.state.isFormValid} >Добавить</Button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Window