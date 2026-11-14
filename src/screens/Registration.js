import React, {useReducer, useState, useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import Autocomplete from '@mui/joy/Autocomplete'
import {main} from '../utilities/appState'
import FloatingLabelInput, {fieldSx} from '../components/FloatingLabelInput'
import Button from '../components/Button'
import Constants from '../Constants'
import countries from '../utilities/countries'

import Styles from './styles/Registration.module.css'

const tg = window.Telegram?.WebApp
const user = tg?.initDataUnsafe?.user

const inputStyle = {
    'marginBottom': '16px'
}

// Выпадающий список стран в стиле приложения
const listboxSx = {
    mt: '4px',
    p: '6px',
    border: '1.5px solid #d8c88a',
    borderRadius: '16px',
    background: '#fffdf8',
    boxShadow: '0 8px 24px rgba(20, 16, 10, 0.18)',
    fontFamily: 'Minion Pro Regular',
    '--ListItem-radius': '10px',
    '& .MuiAutocomplete-option': {
        color: '#1d1810',
        fontSize: '16px',
    },
    '& .MuiAutocomplete-option[aria-selected="true"]': {
        background: '#fbf3dc',
        fontFamily: 'Minion Pro Bold',
    },
    '& .MuiAutocomplete-option:hover, & .MuiAutocomplete-option.Mui-focused': {
        background: '#f3e9c4',
    },
}

const Registration = () => {
    const navigate = useNavigate()
    // eslint-disable-next-line
    const [_, forceUpdate] = useReducer((x) => x + 1, 0)
    const [firstname, setFirstName] = useState(user?.first_name || '')
    const [lastname, setLastname] = useState(user?.last_name || '')
    const [country, setCountry] = useState('')
    const [city, setCity] = useState('')

    const isDisableButton = !firstname || !lastname || !country || !city

    const handleRegUser = useCallback(async () => {
        await fetch(`${Constants.domain}/users/reg`, {
            method: 'POST',
            body: JSON.stringify({tgId: main.tgId, vkId: main.vkId, firstname, lastname, country, city}),
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
      }, [navigate, firstname, lastname, country, city])

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
        <h2 id={Styles.title}>To save the list, please register</h2>
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
        <Autocomplete
            placeholder='Country'
            onInputChange={handleChangeCountry}
            options={countries}
            sx={[fieldSx, inputStyle]}
            slotProps={{listbox: {sx: listboxSx}}}
            value={country}
            autoComplete={true}
            autoSelect={true}
            freeSolo={true}
        />
        <FloatingLabelInput
            style={inputStyle}
            onChange={handleChangeCity}
            label='City'
            value={city}
        />
        <Button className={Styles.regButton} onClick={handleRegUser} disabled={isDisableButton}>
            Sign up
        </Button>
    </div>
}

export default Registration
