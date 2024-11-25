import React, {useState} from 'react'
import {useLocation} from 'react-router-dom'
import Constants from '../Constants'
import Weapon from './Weapon'
import DamageTable from './DamageTable'
import Target from './Target'

import './styles/Calculator.css'

const Calculator = () => {
    const {weapons} = useLocation().state
    const [_weapons, setWeapons] = useState(weapons || [{critOn: Constants.critOn[2]}])
    const [target, setTarget] = useState({})
    const [updateCount, setUpdateCount] = useState(0)

    const handleAddWeapon = () => {
        setWeapons([..._weapons, {critOn: Constants.critOn[2]}])
    }

    const handleChangeCharacteristics = (characteristic, value, index) => {
        const newWeapons = [..._weapons]
        newWeapons[index][characteristic] = value
        setWeapons(newWeapons)
    }

    const handleChangeAbilitiy = (type, index) => {
        const newWeapons = [..._weapons]
        newWeapons[index][type] = !newWeapons[index][type]
        setWeapons(newWeapons)
    }

    const handleDeleteWeapon = (index) => {
        const newWeapons = [..._weapons]
        newWeapons.splice(index, 1)
        setWeapons(newWeapons)
        setUpdateCount(updateCount + 1)
    }

    const handleChangeTarget = (type, value) => {
        const newTartget = {...target}
        if (type === 'isEthereal') {
            newTartget.isEthereal = !newTartget.isEthereal
        } else {
            newTartget[type] = value
        }
        setTarget(newTartget)
    }

    const renderWeapon = (weapon, index) => <Weapon
        index={index}
        weapon={weapon}
        onChange={handleChangeCharacteristics}
        onChangeAbilitiy={handleChangeAbilitiy}
        onDelete={handleDeleteWeapon}
        updateCount={updateCount}
    />

    return  <div id='column' className='Chapter'>
        <button id='calculatorAddWeapon' onClick={handleAddWeapon}>Add Weapon</button>
        <DamageTable weapons={_weapons} target={target} />
        {_weapons.map(renderWeapon)}
        <Target target={target} onChange={handleChangeTarget} />
    </div>
}

export default Calculator