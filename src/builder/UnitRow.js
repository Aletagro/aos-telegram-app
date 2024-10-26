import React from 'react'

import './styles/UnitRow.css'

const UnitRow = ({unit, unitIndex, onClick, onDelete, onReinforced}) => {
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

    const handleReinforced = () => {
        if (onReinforced) {
            onReinforced(unit, unitIndex)
        }
    }

    return <div className='unitRow'>
        <button id='addUnitButton' onClick={handleClick}>
            <p id='title'>{unit.name}</p>
            <p id='price'>{unit.points || unit.regimentOfRenownPointsCost} ponts</p>
        </button>
        {unit.cannotBeReinforced
            ? null
            : <>
                <p>isReinforced</p>
                <input
                    type='checkbox'
                    name='reinforced'
                    value='reinforced' 
                    onChange={handleReinforced}
                />
            </>
        }
        {onDelete ? <button id='deleteUnitButton' onClick={handleDelete}>Delete</button> : null}
    </div>
}

export default UnitRow