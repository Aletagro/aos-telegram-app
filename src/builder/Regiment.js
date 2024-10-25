import React from 'react';
import {useNavigate} from 'react-router-dom'
import {roster} from './roster'
import UnitRow from './UnitRow'
import './styles/Regiment.css'

// const dataBase = require('../dataBase.json')

const Regiment = ({regiment, index, alliganceId, forceUpdate}) => {
    const navigate = useNavigate()

    const handleDeleteRegiment = () => {
        const newRegiments = [...roster.regiments]
        roster.points = roster.points - newRegiments[index].points
        newRegiments.splice(index, 1)
        roster.regiments = newRegiments
        forceUpdate()
    }

    const handleAddUnit = (regiment, title, index) => () => {
        navigate('addUnit', {state: {
            heroId: regiment.heroId,
            regimentId: index,
            alliganceId,
            title
        }})
    }

    const handleClickUnit = (unit) => {
        navigate('warscroll', {state: {title: unit.name, unit}})
    }

    const handleDeleteUnit = (unit, unitIndex) => {
        const newRegiment = {...regiment}
        if (unitIndex === 0) {
            handleDeleteRegiment()
        } else {
            roster.points = roster.points - unit.points
            newRegiment.points = newRegiment.points - unit.points
            newRegiment.units.splice(unitIndex, 1)
            roster.regiments[index] = newRegiment
        }
        forceUpdate()
    }

    const handleChooseGeneral = () => {
        roster.generalRegimentIndex = index
        forceUpdate()
    }
   
    const renderUnit = (unit, index) => <UnitRow
        key={index}
        unit={unit}
        onClick={handleClickUnit}
        onDelete={handleDeleteUnit}
        unitIndex={index}
    />

    const title = regiment.heroId ? 'Add Unit' : 'Add Hero'
    return <div key={index}>
        <p>Regiment {index + 1}</p>
        <p>{regiment.points} Points</p>
        {regiment.heroId
            ? roster.generalRegimentIndex === index
                ? <p>General's Regiment</p>
                : <button id='chooseGeneral' onClick={handleChooseGeneral}>Сhoose General</button>
            : null
        }
        {regiment.units.map(renderUnit)}
        <button onClick={handleAddUnit(regiment, title, index)}>{title}</button>
        <button onClick={handleDeleteRegiment}>Delete</button>
    </div>
}

export default Regiment