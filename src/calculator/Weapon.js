import React, {useState, useEffect} from 'react';
import Close from '../icons/close.svg'
import {getValue} from '../utilities/utils'
import Constants from '../Constants'
import './styles/Weapon.css'

const Weapon = ({index, weapon, onChange, onChangeAbilitiy, onDelete, updateCount}) => {
    const [errors, setErrors] = useState({})
    const [weaponName, setWeaponName] = useState(weapon.name || '')

    const getInputsValues = () => {
        const values = {}
        if (weapon) {
            Constants.calculatorInputs.forEach(item => values[item.type] = weapon[item.type] || '')
            Constants.calculatorCharacteristics.forEach(item => {
                if (item.hasCustom) {
                    values[item.type] = weapon[item.type] || ''
                }
            })
        }
        return values
    }

    const [inputsValues, setInputsValues] = useState(getInputsValues)

    useEffect(() => {
        setWeaponName(weapon.name)
        setInputsValues(getInputsValues)
    /* eslint-disable react-hooks/exhaustive-deps */
    }, [updateCount])

    const handleDelete = () => {
        if (onDelete) {
            onDelete(index)
        }
    }

    const handleChangeName = (e) => {
        setWeaponName(e.target.value)
    }

    const handleBlurName = (e) => {
        onChange('name', e.target.value, index)
    }

    const handleChangeCharacteristic = (type) => (e) => {
        setInputsValues({...inputsValues, [type]: e.target.value})
    }

    const handleBlurCharacteristic = (type) => (e) => {
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
        <input id='calculatorInput' value={inputsValues[data.type]} onChange={handleChangeCharacteristic(data.type)} onBlur={handleBlurCharacteristic(data.type)}/>
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
                        onChange={handleChangeCharacteristic(characteristic.type)}
                        onBlur={handleBlurCharacteristic(characteristic.type)}
                        value={inputsValues[characteristic.type]}
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
            <input id='calculatorNameInput' value={weaponName} onChange={handleChangeName} onBlur={handleBlurName}/>
            <button id='weaponDeleteButton' onClick={handleDelete}><img src={Close} alt="" /></button>
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