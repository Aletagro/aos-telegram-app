import React, {useState} from 'react'
import {useLocation} from 'react-router-dom'
import Weapon from './Weapon'
import DamageTable from './DamageTable'
import Target from './Target'
import './styles/Calculator.css'

const Calculator = () => {
    const {weapons} = useLocation().state
    const [_weapons, setWeapons] = useState(weapons || [{}])
    const [target, setTarget] = useState({})

    const handleAddWeapon = () => {
        setWeapons([..._weapons, {}])
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
    />

    return  <div id='column' className='Chapter'>
        <button id='calculatorAddWeapon' onClick={handleAddWeapon}>Add Weapon</button>
        <DamageTable weapons={_weapons} target={target} />
        {_weapons.map(renderWeapon)}
        <Target target={target} onChange={handleChangeTarget} />
    </div>
}

export default Calculator