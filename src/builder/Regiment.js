import React from 'react';
import {useNavigate} from 'react-router-dom'
import {roster} from '../utilities/appState'
import UnitRow from './UnitRow'
import Delete from '../icons/delete.svg'
import './styles/Regiment.css'

const emptyRegiment = {
    units: [],
    heroId: '',
    points: 0,
    artefact: '',
    heroicTrait: ''
}

const Regiment = ({regiment, index, alliganceId, forceUpdate, artefacts, heroicTraits}) => {
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
            roster.points = roster.points - newRegiment.points
            roster.regiments[index] = emptyRegiment
        } else {
            roster.points = roster.points - unit.points
            newRegiment.points = newRegiment.points - unit.points
            newRegiment.units.splice(unitIndex, 1)
            roster.regiments[index] = newRegiment
        }
        forceUpdate()
    }

    const handleCopy = (unit) => {
        roster.regiments[index].units.push(unit)
        roster.regiments[index].points = roster.regiments[index].points + unit.points
        roster.points = roster.points + unit.points
        forceUpdate()
    }

    const handleReinforced = (unit, unitIndex) => {
        if (unit.isReinforced) {
            const _points = unit.points / 2
            roster.regiments[index].units[unitIndex] = {
                ...roster.regiments[index].units[unitIndex],
                isReinforced: false,
                points: _points
            }
            roster.regiments[index].points = roster.regiments[index].points - _points
            roster.points = roster.points - _points
        } else {
            roster.regiments[index].units[unitIndex] = {
                ...roster.regiments[index].units[unitIndex],
                isReinforced: true,
                points: unit.points * 2
            }
            roster.regiments[index].points = roster.regiments[index].points + unit.points
            roster.points = roster.points + unit.points
        }
        forceUpdate()
    }

    const handleChooseGeneral = () => {
        roster.generalRegimentIndex = index
        forceUpdate()
    }
       
    const renderUnit = (unit, _index) => <UnitRow
        key={_index}
        unit={unit}
        unitIndex={_index}
        regimentIndex={index}
        onClick={handleClickUnit}
        onDelete={handleDeleteUnit}
        onReinforced={handleReinforced}
        onCopy={handleCopy}
        artefacts={artefacts}
        heroicTraits={heroicTraits}
    />

    const title = regiment.heroId ? 'Add Unit' : 'Add Hero'
    return <div id='regimentContainer' key={index}>
        <div id='regimentTitle'>
            <p id='regimentText'>Regiment {index + 1}</p>
            <div id='regimentRightBlock'>
                <p id='regimentText'>{regiment.points} Points</p>
                <button id='regimentDeleteButton' onClick={handleDeleteRegiment}><img src={Delete} alt="" /></button>
            </div>
        </div>
        {regiment.heroId
            ? <div>
                {roster.generalRegimentIndex === index
                    ? <p id='regimentSubTitle'>General's Regiment</p>
                    : <button id='regimentButton' onClick={handleChooseGeneral}>Сhoose General</button>
                }
            </div>
            : null
        }
        {regiment.units.map(renderUnit)}
        <div id='regimentAddUnitContainer'>
            <button id='regimentAddUnitButton' onClick={handleAddUnit(regiment, title, index)}>{title}</button>
        </div>
    </div>
}

export default Regiment