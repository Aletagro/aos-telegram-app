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

    return <div id='unitRowContainer'>
        <button  className='unitRow' onClick={handleClick}>
            <p id='title'>{unit.name}</p>
            <p id='price'>{unit.points} ponts</p>
        </button>
        {onDelete ? <button onClick={handleDelete}>Delete</button> : null}
    </div>
}

export default UnitRow