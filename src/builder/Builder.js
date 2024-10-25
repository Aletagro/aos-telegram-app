import React, {useCallback, useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom'
import Row from '../components/Row'
import './styles/Builder.css'

// const dataBase = require('../dataBase.json')

const emptyRegiment = {
    units: [],
    isGeneral: false,
    generalId: '',
    points: 0
}

const Builder = () => {
    const {alligance} = useLocation().state
    const navigate = useNavigate()
    const [regiments, setRegiments] = useState([])

    const handleAddRegiment = useCallback(() => {
        setRegiments([...regiments, emptyRegiment])
    }, [regiments])

    const handleAddUnit = (regiment, title) => () => {
        navigate('addUnit', {state: {
            alliganceId: alligance.id,
            generalId: regiment.generalId,
            title
        }})
    }
   
    const renderUnit = (unit) => <Row
        key={unit?.id}
        title={unit?.name}
        navigateTo='warscroll'
        state={{unit}}
    />

    const renderRegiment = (regiment) => {
        const title = regiment.generalId ? 'Add Unit' : 'Add Hero'
        return <>
            {regiment.units.map(renderUnit)}
            <button onClick={handleAddUnit(regiment, title)}>{title}</button>
        </>
    }

    return <div id='column' className='Chapter'>
        {regiments.map(renderRegiment)}
        <button onClick={handleAddRegiment}>Add Regiment</button>
    </div>
}

export default Builder