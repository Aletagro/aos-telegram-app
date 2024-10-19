import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom'
import Ability from './Ability'
import './styles/Warscroll.css'

const dataBase = require('../dataBase.json')

const Warscroll = () => {
    const navigate = useNavigate()
    const unit = useLocation().state.unit
    const weapons = dataBase.data.warscroll_weapon.filter(weapon => weapon.warscrollId === unit.id)
    const meleeWeapons = weapons.filter(weapon => weapon.type === 'melee')
    const rangeWeapons = weapons.filter(weapon => weapon.type === 'ranged')
    let abilities = dataBase.data.warscroll_ability.filter(ability => ability.warscrollId === unit.id)
    const regimentOptions = dataBase.data.warscroll_regiment_option.filter(option => option.warscrollId === unit.id)
    const isManifestation = unit.referenceKeywords.includes('Manifestation')
    const manifestationInfo = isManifestation ? dataBase.data.lore_ability.find(ability => ability.linkedWarscrollId === unit.id) : undefined
    if (manifestationInfo) {
        abilities = [...abilities, manifestationInfo]
    }

    const getWeaponAbilities = (weaponId) => {
        const abilitiesIds = dataBase.data.warscroll_weapon_weapon_ability.filter(ability => ability.warscrollWeaponId === weaponId).map(ability => ability.weaponAbilityId)
        const abilities = abilitiesIds.map(abilityId => dataBase.data.weapon_ability.find(wpAbility => wpAbility.id === abilityId))
        return abilities
    }

    const renderWeaponAbility = (ability) => <p id='weaponAbilities'>{ability.name}</p>

    const renderRangeWeapon = (weapon) => {
        const weaponAbilities = getWeaponAbilities(weapon.id)
        return <>
            <div className='rangeWeapons'>
                <p className='rangeWeaponName'>{weapon.name}</p>
                <p className='rangeWeaponRng'>Range</p>
                <p className='rangeWeaponRange'>{weapon.range}</p>
                <p className='rangeWeaponA'>A</p>
                <p className='rangeWeaponAttacks'>{weapon.attacks}</p>
                <p className='rangeWeaponH'>HIT</p>
                <p className='rangeWeaponHit'>{weapon.hit}</p>
                <p className='rangeWeaponW'>W</p>
                <p className='rangeWeaponWound'>{weapon.wound}</p>
                <p className='rangeWeaponR'>R</p>
                <p className='rangeWeaponRend'>{weapon.rend}</p>
                <p className='rangeWeaponD'>D</p>
                <p className='rangeWeaponDamage'>{weapon.damage}</p>
            </div>
            <div id='row' className='weaponAbilitiesContainer'>
                {weaponAbilities.map(renderWeaponAbility)}
            </div>
        </>
    }

    const renderMeleeWeapon = (weapon) => {
        const weaponAbilities = getWeaponAbilities(weapon.id)

        return <>
            <div className='meleeWeapons'>
                <p className='weaponName'>{weapon.name}</p>
                <p className='weaponA'>A</p>
                <p className='weaponAttacks'>{weapon.attacks}</p>
                <p className='weaponH'>HIT</p>
                <p className='weaponHit'>{weapon.hit}</p>
                <p className='weaponW'>W</p>
                <p className='weaponWound'>{weapon.wound}</p>
                <p className='weaponR'>R</p>
                <p className='weaponRend'>{weapon.rend}</p>
                <p className='weaponD'>D</p>
                <p className='weaponDamage'>{weapon.damage}</p>
            </div>
            <div id='row' className='weaponAbilitiesContainer'>
                {weaponAbilities.map(renderWeaponAbility)}
            </div>
        </>
    }

    const renderAbility = (ability) => <Ability key={ability.id} ability={ability} />

    const renderRegimentOption = (option) => <p>- {option.optionText}</p>

    return <>
        <button type="button" onClick={() => {navigate(-1)}}>
          Назад
        </button>
        <h1 className='title'>{unit.name}</h1>
        <img src={unit.bannerImage} alt={unit.name} width='100%' />
        <div>
            <h4>Characteristics</h4>
            <p>Move: {unit.move}</p>
            <p>Health: {unit.health}</p>
            {isManifestation
                ? <>
                    <p>Banishment: {unit.control}</p>
                    <p>Casting Value: {manifestationInfo.castingValue}+</p>
                </>
                : <p>Control: {unit.control}</p>
            }
            <p>Save: {unit.save}</p>
        </div>
        {rangeWeapons.length > 0
            ? <>
                <h4>Range Weapons</h4>
                {rangeWeapons.map(renderRangeWeapon)}
            </>
            : null
        }
        {meleeWeapons.length > 0
            ? <>
                <h4>Melee Weapons</h4>
                {meleeWeapons.map(renderMeleeWeapon)}
            </>
            : null
        }
        {abilities.length > 0
            ? <>
                <h4>Abilities</h4>
                {abilities.map(renderAbility)}
            </>
            : null
        }
        <>
            <h4>Unit Details</h4>
            <p>{unit.modelCount} model</p>
            {unit.wargearOptionsText ? <p id='wargearOptions'>{unit.wargearOptionsText}</p> : null}
            {unit.points ? <p>{unit.points} points</p> : null}
            {regimentOptions.length > 0
                ? <>
                    <h5>Regiment Options</h5>
                    {regimentOptions.map(renderRegimentOption)}
                    {unit.notes ? <p>Notes: {unit.notes}</p> : null}
                    <p>Размер базы: {unit.baseSize}</p>
                </>
                : null
            }
        </>
        {unit.referenceKeywords
            ? <>
                <h4>Keywords: {unit.referenceKeywords}</h4>
            </>
            : null
        }
        <h6>{unit.lore}</h6>
    </>
}

export default Warscroll