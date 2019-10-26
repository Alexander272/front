import React, {Component} from 'react'
import classes from './Main.css'
import Table from './../../Components/UI/Table/Table'
import Button from '../../Components/UI/Button/Button'
import Window from '../Window/Window'
import axios from './../../axios/axios'
import Loader from './../../Components/UI/Loader/Loader';

class Main extends Component {

    state = {
        tbody: [],
        isOpenWindow: false,
        loading: true
    }

    addCompanyHandler = event => {
        event.preventDefault()
        this.setState({ isOpenWindow: true })
    }

    changeStateHandler = data => {
        const tbody = this.state.tbody
        tbody.push(data)
        this.setState({ tbody })
    }

    closeWindowHandler = () => {
        this.setState({ isOpenWindow: false })
    }

    async componentDidMount() {
        try {
            const response = await axios.get('/companyList.json')
            const tbody = []
            if (!response.data) return
            Object.keys(response.data).forEach(key => {
                const data = response.data[key]
                tbody.push({
                    name: data.name,
                    address: data.address,
                    ogrn: data.ogrn,
                    inn: data.inn,
                    date: data.date,
                    id: key
                })
            })
            this.setState({tbody, loading: false})
        } catch (error) {
            console.log(error)
        }
    }

    deleteCompanyHundler = async event => {
        try {
            const id = event.target.dataset.id
            const tbody =  this.state.tbody
            for (let i = 0; i < tbody.length; i++) {
                let obj = tbody[i]
            
                if (id.indexOf(obj.id) !== -1) {
                    tbody.splice(i, 1)
                    i--
                }
            }
            this.setState({ tbody })
            await axios.delete(`/companyList/${id}.json`)
        } catch (error) {
            console.log(error)
        }
    }

    changeAddressHandler = async event => {
        const tbody = this.state.tbody
        let elem
        const id = event.target.dataset.id
        
        for (let i = 0; i < tbody.length; i++) {
            let obj = tbody[i]

            if (id.indexOf(obj.id) !== -1) {
                tbody[i].address = event.target.value
                elem = tbody[i]
            }
        }
        this.setState({tbody})

        await axios.put(`/companyList/${id}.json`, elem).catch(error => console.log(error))
    }

    render() {
        const thead = ['наименование', 'адрес', 'огрн', 'инн', 'дата регистрации']

        return (
            <div className = {classes.Main}>
                <Button type = "primary" onClick = {this.addCompanyHandler}>Добавить</Button>
                {
                    this.state.loading
                    ? <Loader />
                    : <Table
                            thead={thead}
                            tbody={this.state.tbody}
                            deleteCompanyHundler={this.deleteCompanyHundler}
                            changeAddressHandler={this.changeAddressHandler}
                        />
                }
                
                { this.state.isOpenWindow 
                    ? <Window 
                        thead = {thead} 
                        changeStateHandler = {this.changeStateHandler} 
                        closeWindowHandler = {this.closeWindowHandler}
                    /> 
                    : null}
            </div>
        )
    }
}

export default Main