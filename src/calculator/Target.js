import React from 'react';
import './styles/Weapon.css'

const wards = [3, 4, 5, 6, 0]

const Target = ({target, onChange}) => {

    const handleChangeSave = (value) => () => {
        onChange('ward', value)
    }

    const handleClickIsEthereal = () => {
        onChange('isEthereal')
    }

    const renderButton = (value) => <button
        key={value}
        onClick={handleChangeSave(value)}
        id={target.ward === value ? 'calculatorWeaponCheckedAbilities' : 'calculatorWeaponAbilities'}
    >
        {value || 'No Ward'}
    </button>

    const renderWard = () => <div>
        <p id='calculatorInputTitle'>Ward</p>
        <div id='calculatorCharacteristicsContainer'>
            {wards.map(renderButton)}
        </div>
    </div>

    return  <div id='calculatorWeaponContainer'>
        <p id='calculatorTargetTitle'>Target</p>
        {renderWard()}
        <div id='calculatorWeaponAbilitiesContainer'>
            <button
                onClick={handleClickIsEthereal}
                id={target.isEthereal ? 'calculatorWeaponCheckedAbilities' : 'calculatorWeaponAbilities'}
            >
                is Ethereal
            </button>
        </div>
    </div>
}

export default Target