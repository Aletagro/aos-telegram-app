import React from 'react'
import {useNavigate} from 'react-router-dom'
import Copy from '../icons/copy.svg'
import Delete from '../icons/delete.svg'
import Plus from '../icons/plus.svg'
import Minus from '../icons/minus.svg'

import './styles/UnitRow.css'

const UnitRow = ({unit, unitIndex, regimentIndex, isAddUnit, onClick, onDelete, onCopy, onReinforced, artefacts, heroicTraits, withoutCopy}) => {
    const navigate = useNavigate()
    const isHero = unit.referenceKeywords?.includes('Hero') 
    const isShowEnhancements = isHero && !unit.referenceKeywords?.includes('Unique')

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

    const handleCopy = () => {
        if (onCopy) {
            onCopy(unit)
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
                <p id='unitName'>{unit.name}</p>
                <p id='price'>{unit.points || unit.regimentOfRenownPointsCost || 0} ponts</p>
            </button>
            {isAddUnit || unit.cannotBeReinforced || unit.abilityGroupType === 'regimentOfRenown'
                ? null
                : unit.isReinforced
                    ? <button id='unitRowButton' onClick={handleReinforced}><img src={Minus} alt="" /></button>
                    : <button id='unitRowButton' onClick={handleReinforced}><img src={Plus} alt="" /></button>
            }
            {isAddUnit || isHero || withoutCopy
                ? null
                : <button id='unitRowButton' onClick={handleCopy}><img src={Copy} alt="" /></button>
            }
            {onDelete ? <button id='unitRowButton' onClick={handleDelete}><img src={Delete} alt="" /></button> : null}
        </div>
        {isShowEnhancements && !isAddUnit
            ? <div id='enhancementsContainer'>
                <button id='chooseEnhancementButton' onClick={handleChooseEnhancement('Artefacts', 'artefact')}>
                    {unit.artefact ? `Artefact: ${unit.artefact}` : 'Сhoose Artefact'}
                </button>
                <button id='chooseEnhancementButton' onClick={handleChooseEnhancement('Heroic Traits', 'heroicTrait')}>
                    {unit.heroicTrait ? `Heroic Trait: ${unit.heroicTrait}` : 'Сhoose Heroic Trait'}
                </button>
            </div>
            : null
        }
    </div>
}

export default UnitRow