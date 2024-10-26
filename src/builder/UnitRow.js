import React from 'react'

import './styles/UnitRow.css'

const UnitRow = ({unit, unitIndex, onClick, onDelete}) => {
    const handleClick = () => {
        if (onClick) {
            onClick(unit)
        }
    }

    const handleDelete = () => {
        if (onDelete) {
            onDelete(unit, unitIndex)
        }
    }

    return <div className='unitRow'>
        <button id='addUnitButton' onClick={handleClick}>
            <p id='title'>{unit.name}</p>
            <p id='price'>{unit.points} ponts</p>
        </button>
        {onDelete ? <button id='deleteUnitButton' onClick={handleDelete}>Delete</button> : null}
    </div>
}

export default UnitRow