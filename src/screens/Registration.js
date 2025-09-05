import React, {useReducer, useState, useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import {main} from '../utilities/appState'
import FloatingLabelInput from '../components/FloatingLabelInput'

import Styles from './styles/Registration.module.css'

const tg = window.Telegram.WebApp

const inputStyle = {
    '--Input-minHeight': '48px',
    'borderRadius': '4px',
    'marginBottom': '16px',
    'borderColor': '#B4B4B4',
    'boxShadow': 'none',
    'fontFamily': 'Minion Pro Regular'
}

const Registration = () => {
    const navigate = useNavigate()
    // eslint-disable-next-line
    const [_, forceUpdate] = useReducer((x) => x + 1, 0)
    const user = tg.initDataUnsafe?.user
    const [firstname, setFirstName] = useState(user?.first_name || '')
    const [lastname, setLastname] = useState(user?.last_name || '')
    const [country, setCountry] = useState(user?.country || '')
    const [city, setCity] = useState('')

    const isDisableButton = !firstname || !lastname || !country || !city

    const handleRegUser = useCallback(async () => {
        await fetch('https://aoscom.online/users/reg', {
            method: 'POST',
            body: JSON.stringify({tg_id: user?.id, firstname, lastname, country, city}),
            headers: {
                'Content-Type': 'application/json',
                'Accept': "application/json, text/javascript, /; q=0.01"
            }
        })
            .then(response => response.json())
            .then(data => {
                navigate(-1)
                main.user = data.user_info
                main.showSaveListModal = true
            })
            .catch(error => console.error(error))
      }, [navigate, firstname, lastname, country, city, user, user?.id])

    const handleChangeFirstName = (e) => {
        setFirstName(e.target.value)
    }

    const handleChangeLastname = (e) => {
        setLastname(e.target.value)
    }

    const handleChangeCountry = (e, value) => {
        setCountry(value || e.target.value)
    }

    const handleChangeCity = (e, value) => {
        setCity(value || e.target.value)
    }

    return <div id='column' className='Chapter'>
        <p id={Styles.title}>To save the list, please register</p>
        <FloatingLabelInput
            style={inputStyle}
            onChange={handleChangeFirstName}
            label='Name'
            value={firstname}
        />
        <FloatingLabelInput
            style={inputStyle}
            onChange={handleChangeLastname}
            label='Surname'
            value={lastname}
        />
        <FloatingLabelInput
            style={inputStyle}
            onChange={handleChangeCountry}
            label='Country'
            value={country}
        />
        <FloatingLabelInput
            style={inputStyle}
            onChange={handleChangeCity}
            label='City'
            value={city}
        />
        <button
            id={isDisableButton ? Styles.disableRegButton : Styles.regButton}
            onClick={handleRegUser}
            disabled={isDisableButton}
        >
            Sign up
        </button>
    </div>
}

export default Registration
