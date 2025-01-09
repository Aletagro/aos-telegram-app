import React, {useState} from 'react'
import Autocomplete from '@mui/joy/Autocomplete'
import {ToastContainer, toast} from 'react-toastify'
import Constants from '../Constants'
import FloatingLabelInput from '../components/FloatingLabelInput'

import Styles from './styles/Registration.module.css'

const tg = window.Telegram.WebApp

const inputStyle = {
    '--Input-minHeight': '48px',
    'borderRadius': '4px',
    'margin': '16px',
    'border-color': '#B4B4B4',
    'box-shadow': 'none',
    'font-family': 'Minion Pro Regular'
}

const top100Films = [
    { label: 'The Shawshank Redemption', year: 1994 },
    { label: 'The Godfather', year: 1972 },
    { label: 'The Godfather: Part II', year: 1974 },
    { label: 'The Dark Knight', year: 2008 },
    { label: '12 Angry Men', year: 1957 },
    { label: "Schindler's List", year: 1993 },
    { label: 'Pulp Fiction', year: 1994 },
    {
      label: 'The Lord of the Rings: The Return of the King',
      year: 2003,
    },
    { label: 'The Good, the Bad and the Ugly', year: 1966 },
    { label: 'Fight Club', year: 1999 }
]

const Registration = () => {
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [city, setCity] = useState('')
    const [data, setData] = useState(null)

    const initData = JSON.stringify(tg.initDataUnsafe)

    const handleChangeName = (e) => {
        setName(e.target.value)
    }

    const handleChangeSurname = (e) => {
        setSurname(e.target.value)
    }

    console.log('data', data)
    console.log('initData', initData)

    const handleChangeCity = (e, value) => {
        const _value = value || e.target.value
        setCity(_value)
        fetch(`https://hh.ru/shards/area_switcher/search?q=${_value}`, {mode: 'no-cors'})
        // fetch('https://openlibrary.org/search/authors.json?q=tolkien')
            .then(response => {
                console.log(response)
                return response.json()
            })
            .then(json => setData(json))
            .catch(error => console.error(error));
        toast.success('data', Constants.toastParams)
    }

    const handleClickButton = () => {
        toast.success(`${name}, ${surname}, ${city}`, Constants.toastParams)
    }

    return <div>
        <h2 id={Styles.title}>Регистрация на Ural GT 2025</h2>
        <FloatingLabelInput
            style={inputStyle}
            onChange={handleChangeName}
            label='Ваше имя'
            value={name}
        />
        <FloatingLabelInput
            style={inputStyle}
            onChange={handleChangeSurname}
            label='Ваша фамилия'
            value={surname}
        />
        <Autocomplete
            placeholder='Город'
            onInputChange={handleChangeCity}
            options={top100Films}
            sx={inputStyle}
            value={city}
            autoComplete={true}
            autoSelect={true}
            freeSolo={true}
        />
        <div id={Styles.buttonContainer}>
            <button id={Styles.button} onClick={handleClickButton}>Зарегистрироваться</button>
        </div>
        <p>initDataUnsafe: {initData}</p>
        <p>user: {initData?.user}</p>
        <ToastContainer />
    </div>
}

export default Registration