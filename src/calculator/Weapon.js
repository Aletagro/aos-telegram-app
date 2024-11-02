import React, {useState} from 'react';
import Delete from '../icons/delete.svg'
import {getValue} from '../utilities/utils'
import Constants from '../Constants'
import './styles/Weapon.css'

const Weapon = ({index, weapon, onChange, onChangeAbilitiy, onDelete}) => {
    const [errors, setErrors] = useState({})

    const handleDelete = () => {
        if (onDelete) {
            onDelete(index)
        }
    }

    const handleChangeName = (e) => {
        onChange('name', e.target.value, index)
    }

    const handleChangeCharacteristic = (type) => (e) => {
        const value = getValue(e.target.value)
        if (value === undefined || value < 0) {
            setErrors({...errors, [type]: 'Invalide value'})
        } else {
            setErrors({...errors, [type]: ''})
            onChange(type, value, index)
        }
    }

    const handleClickAbility = (type) => () => {
        onChangeAbilitiy(type, index)
    }

    const handleClickCritOn = (value) => () => {
        onChange('critOn', value, index)
    }

    const handleClickCharacteristic = (type, value) => () => {
        onChange(type, value, index)
    }

    const renderInput = (data) => <div id='calculatorInputContainer'>
        <p id='calculatorInputTitle'>{data.name}</p>
        <input id='calculatorInput' defaultValue={weapon[data.type]} onBlur={handleChangeCharacteristic(data.type)}/>
    </div>

    const renderWeaponAbility = (ability) => <button
        key={ability.type}
        onClick={handleClickAbility(ability.type)}
        id={weapon[ability.type] ? 'calculatorWeaponCheckedAbilities' : 'calculatorWeaponAbilities'}
    >
        {ability.name}
    </button>

    const renderCritOnButton = (critOn) => <button
        key={critOn.modificator}
        onClick={handleClickCritOn(critOn)}
        id={weapon.critOn?.modificator === critOn.modificator ? 'calculatorWeaponCheckedAbilities' : 'calculatorWeaponAbilities'}
    >
        {console.log(weapon.critOn, critOn, weapon.critOn === critOn)}
        {critOn.title}
    </button>

    const renderButton = (type) => (value) => <button
        key={`${type}-${value}`}
        onClick={handleClickCharacteristic(type, value)}
        id={weapon[type] === value ? 'calculatorWeaponCheckedAbilities' : 'calculatorWeaponAbilities'}
    >
        {value}
    </button>

    const renderCharacteristics = (characteristic) => <div key={characteristic.type}>
        <p id='calculatorInputTitle'>{characteristic.name}</p>
        <div id='calculatorCharacteristicsContainer'>
            {characteristic.values.map(renderButton(characteristic.type))}
        </div>
        {characteristic.hasCustom
            ? <>
                <div id='weaponCustomDamageContainer'>
                    <p id='weaponCustomDamageTitle'>Custom</p>
                    <input
                        id='weaponCustomDamageInput'
                        onBlur={handleChangeCharacteristic(characteristic.type)}
                        defaultValue={weapon[characteristic.type]}
                        placeholder='d3+3'
                    />
                </div>
                {errors[characteristic.type] ? <p id='error'>{errors[characteristic.type]}</p> : null}
            </>
            : null
        }
    </div>

    return  <div id='calculatorWeaponContainer'>
        <div id='calculatorNameContainer'>
            <p id='calculatorInputTitle'>Name</p>
            <input id='calculatorNameInput' defaultValue={weapon.name}  onBlur={handleChangeName}/>
            <button id='weaponDeleteButton' onClick={handleDelete}><img src={Delete} alt="" /></button>
        </div>
        <div id='calculatorInputsContainer'>
            {Constants.calculatorInputs.map(renderInput)}
        </div>
        {Constants.calculatorCharacteristics.map(renderCharacteristics)}
        <div id='calculatorWeaponAbilitiesContainer'>
            {Constants.calculatorAbilities.map(renderWeaponAbility)}
        </div>
        <div id='calculatorWeaponAbilitiesContainer'>
            <p id='calculatorWeaponCritOn'>Crit on</p>
            {Constants.critOn.map(renderCritOnButton)}
        </div>
    </div>
}

export default Weapon