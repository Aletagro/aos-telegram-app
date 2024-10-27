import React from 'react'
import {useNavigate} from 'react-router-dom'

import './styles/UnitRow.css'

const UnitRow = ({unit, unitIndex, regimentIndex, isAddUnit, onClick, onDelete, onReinforced, artefacts, heroicTraits}) => {
    const navigate = useNavigate()
    const isShowEnhancements = unit.referenceKeywords.includes('Hero') && !unit.referenceKeywords.includes('Unique')

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

    const handleChooseEnhancement = (name, type) => () => {
        const data = type === 'artefact' ? artefacts : heroicTraits
        navigate('chooseEnhancement', {state: {title: name, data, type, unitIndex, regimentIndex}})
    }

    return <div>
        <div className='unitRow'>
            <button id='addUnitButton' onClick={handleClick}>
                <p id='title'>{unit.name}</p>
                <p id='price'>{unit.points || unit.regimentOfRenownPointsCost} ponts</p>
            </button>
            {isAddUnit || unit.cannotBeReinforced
                ? null
                : <>
                    <p>isReinforced</p>
                    <input
                        type='checkbox'
                        name='reinforced'
                        value='reinforced'
                        checked={unit.isReinforced}
                        onChange={handleReinforced}
                    />
                </>
            }
            {onDelete ? <button id='deleteUnitButton' onClick={handleDelete}>Delete</button> : null}
        </div>
        {isShowEnhancements && !isAddUnit
            ? <>
                <div>
                    <p>{unit.artefact}</p>
                    <button id='chooseGeneral' onClick={handleChooseEnhancement('Artefacts', 'artefact')}>Сhoose Artefact</button>
                </div>
                <div>
                    <p>{unit.heroicTrait}</p>
                    <button id='chooseGeneral' onClick={handleChooseEnhancement('Heroic Traits', 'heroicTrait')}>Сhoose Heroic Trait</button>
                </div>
            </>
            : null
        }
    </div>
}

export default UnitRow