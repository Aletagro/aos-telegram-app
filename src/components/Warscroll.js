import React from 'react';
import {useLocation} from 'react-router-dom'
import Ability from './Ability'
import './styles/Warscroll.css'

const dataBase = require('../dataBase.json')

const Warscroll = () => {
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
            <p className='weaponName'>{weapon.name}</p>
            <div className='rangeWeapons'>
                <p>Range</p>
                <p>A</p>
                <p>HIT</p>
                <p>W</p>
                <p>R</p>
                <p>D</p>
                <p>{weapon.range}</p>
                <p>{weapon.attacks}</p>
                <p>{weapon.hit}</p>
                <p>{weapon.wound}</p>
                <p>{weapon.rend}</p>
                <p>{weapon.damage}</p>
            </div>
            <div id='row' className='weaponAbilitiesContainer'>
                {weaponAbilities.map(renderWeaponAbility)}
            </div>
        </>
    }

    const renderMeleeWeapon = (weapon) => {
        const weaponAbilities = getWeaponAbilities(weapon.id)

        return <>
            <p className='weaponName'>{weapon.name}</p>
            <div className='meleeWeapons'>
                <p>A</p>
                <p>HIT</p>
                <p>W</p>
                <p>R</p>
                <p>D</p>
                <p>{weapon.attacks}</p>
                <p>{weapon.hit}</p>
                <p>{weapon.wound}</p>
                <p>{weapon.rend}</p>
                <p>{weapon.damage}</p>
            </div>
            <div id='row' className='weaponAbilitiesContainer'>
                {weaponAbilities.map(renderWeaponAbility)}
            </div>
        </>
    }

    const renderAbility = (ability) => <Ability key={ability.id} ability={ability} />

    const renderRegimentOption = (option) => <p>- {option.optionText}</p>

    return <div id='warscroll'>
        <h1 className='title'>{unit.name}</h1>
        <img src={unit.bannerImage} alt={unit.name} width='100%' />
        <div>
            <h3>Characteristics</h3>
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
                <h3>Range Weapons</h3>
                {rangeWeapons.map(renderRangeWeapon)}
            </>
            : null
        }
        {meleeWeapons.length > 0
            ? <>
                <h3>Melee Weapons</h3>
                {meleeWeapons.map(renderMeleeWeapon)}
            </>
            : null
        }
        {abilities.length > 0
            ? <>
                <h3>Abilities</h3>
                {abilities.map(renderAbility)}
            </>
            : null
        }
        <>
            <h3>Unit Details</h3>
            <p>{unit.modelCount} model</p>
            {unit.wargearOptionsText ? <p id='wargearOptions'>{unit.wargearOptionsText}</p> : null}
            {unit.points ? <p>{unit.points} points</p> : null}
            <p><b>Размер базы:</b> {unit.baseSize}</p>
            {regimentOptions.length > 0
                ? <>
                    <b>Regiment Options</b>
                    {regimentOptions.map(renderRegimentOption)}
                </>
                : null
            }
            {unit.notes ? <p>Notes: {unit.notes}</p> : null}
        </>
        {unit.referenceKeywords
            ? <>
                <p id='keywords'>Keywords: <b>{unit.referenceKeywords}</b></p>
            </>
            : null
        }
        <p id='textItalic'>{unit.lore}</p>
    </div>
}

export default Warscroll