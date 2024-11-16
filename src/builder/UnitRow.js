import React from 'react'
import {useNavigate} from 'react-router-dom'
import Copy from '../icons/copy.svg'
import Close from '../icons/close.svg'
import Plus from '../icons/plus.svg'
import Minus from '../icons/minus.svg'
import DarkGeneral from '../icons/darkGeneral.svg'
import {capitalizeFirstLetter, camelCaseToWords} from '../utilities/utils'

import './styles/UnitRow.css'

const dataBase = require('../dataBase.json')

const UnitRow = ({unit, unitIndex, regimentIndex, isAddUnit, onClick, onDelete, onCopy, onReinforced, artefacts, heroicTraits, withoutCopy, isAuxiliary, isGeneral}) => {
    const navigate = useNavigate()
    const isHero = unit.referenceKeywords?.includes('Hero') 
    const isShowEnhancements = isHero && !unit.referenceKeywords?.includes('Unique')
    const optionGroups = dataBase.data.option_group.filter(group => group.warscrollId === unit.id)
    const marksOfChaos = optionGroups.find(group => group.optionGroupType === 'marksOfChaos')
    const otherWarscrollOption = optionGroups.find(group => group.optionGroupType === 'otherWarscrollOption')
    const weaponOptions = optionGroups.filter(group => group.optionGroupType === 'weapon')

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
        navigate('chooseEnhancement', {state: {title: name, data, type, unitIndex, regimentIndex, isAuxiliary}})
    }

    const handleChooseOption = (optionGroup) => () => {
        navigate('chooseOption', {state: {title: camelCaseToWords(capitalizeFirstLetter(optionGroup.optionGroupType)), optionGroup, unitIndex, regimentIndex, isAuxiliary}})
    }

    const handleWeaponOption = () => {
        navigate('chooseWeapon', {state: {
            title: 'Weapon Options',
            selectedWeaponOptions: unit.weaponOptions,
            weaponOptions,
            unitIndex,
            regimentIndex,
            isAuxiliary,
            isReinforced: unit.isReinforced
        }})
    }

    const renderChooseOptionButton = (option) => <button id='chooseEnhancementButton' onClick={handleChooseOption(option)}>
        {unit[option.optionGroupType]
            ? `${camelCaseToWords(option.optionGroupType)}: ${unit[option.optionGroupType]}`
            : `${camelCaseToWords(option.optionGroupType)}`
        }
    </button>

    const renderChooseWeapon = () => <button id='chooseEnhancementButton' onClick={handleWeaponOption}>
        Weapon Options
    </button>

    return <div id='unitRowContainer'>
        <div className='unitRow'>
            <button id='addUnitButton' onClick={handleClick}>
                <div id='addUnitButtonSubContainer'>
                    {isGeneral ? <img id='generalIcon' src={DarkGeneral} alt=''/> : null}
                    {unit.modelCount > 1 ? <p id='unitName'>{unit.modelCount * (unit.isReinforced ? 2 : 1)}&#160;</p> : null}
                    <p id='unitName'>{unit.name}</p>
                </div>
                <p id='price'>{unit.points || unit.regimentOfRenownPointsCost || 0} pts</p>
            </button>
            {isAddUnit || unit.cannotBeReinforced || unit.abilityGroupType === 'regimentOfRenown'
                ? null
                : unit.isReinforced
                    ? <button id='unitRowButton' onClick={handleReinforced}><img src={Minus} alt="" /></button>
                    : <button id='unitRowButton' onClick={handleReinforced}><img src={Plus} alt="" /></button>
            }
            {isAddUnit || isHero || withoutCopy || isAuxiliary
                ? null
                : <button id='unitRowButton' onClick={handleCopy}><img src={Copy} alt="" /></button>
            }
            {onDelete ? <button id='unitRowButton' onClick={handleDelete}><img src={Close} alt="" /></button> : null}
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
        {optionGroups.length > 0 && !isAddUnit
            ? <div id='enhancementsContainer'>
                {weaponOptions.length > 0 ? renderChooseWeapon() : null}
                {marksOfChaos ? renderChooseOptionButton(marksOfChaos) : null}
                {otherWarscrollOption ? renderChooseOptionButton(otherWarscrollOption) : null}
            </div>
            : null
        }
    </div>
}

export default UnitRow