import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom'
import {roster} from '../utilities/appState'
import {capitalizeFirstLetter} from '../utilities/utils'

import './styles/ChooseOption.css'

const dataBase = require('../dataBase.json')

const ChooseOption = () => {
    const {optionGroup, unitIndex, regimentIndex, isAuxiliary} = useLocation().state
    const navigate = useNavigate()
    const options = dataBase.data.option.filter(option => option.optionGroupId === optionGroup.id)


    const handleClickOption = (option) => () => {
        if (isAuxiliary) {
            const newUnit = {...roster.auxiliaryUnits[unitIndex], [optionGroup.optionGroupType]: capitalizeFirstLetter(option)}
            roster.auxiliaryUnits[unitIndex] = newUnit
        } else {
            const newUnit = {...roster.regiments[regimentIndex].units[unitIndex], [optionGroup.optionGroupType]: capitalizeFirstLetter(option)}
            roster.regiments[regimentIndex].units[unitIndex] = newUnit
        }
        navigate(-1)
    }

    const handleDeleteOption = () => {
        if (isAuxiliary) {
            const newUnit = {...roster.auxiliaryUnits[unitIndex], [optionGroup.optionGroupType]: ''}
            roster.auxiliaryUnits[unitIndex] = newUnit
        } else {
            const newUnit = {...roster.regiments[regimentIndex].units[unitIndex], [optionGroup.optionGroupType]: ''}
            roster.regiments[regimentIndex].units[unitIndex] = newUnit
        }
        navigate(-1)
    }

    const renderOption = (option) => <button id='optionButton' key={option.id} onClick={handleClickOption(option.otherWarscrollOption || option.markOfChaos)}>{option.otherWarscrollOption || capitalizeFirstLetter(option.markOfChaos)}</button>

    return  <div id='column' className='Chapter'>
        <p>{optionGroup.name}</p>
        {options.map(renderOption)}
        <button id='deleteEnhancement' onClick={handleDeleteOption}>Delete</button>
    </div>
}

export default ChooseOption