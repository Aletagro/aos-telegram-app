import React from 'react';
import {useLocation} from 'react-router-dom'
import Ability from '../components/Ability'
import './styles/Warscroll.css'

const dataBase = require('../dataBase.json')

const Warscroll = () => {
    window.scrollTo(0, 0)
    const unit = useLocation().state.unit
    const weapons = dataBase.data.warscroll_weapon.filter(weapon => weapon.warscrollId === unit.id)
    const meleeWeapons = weapons.filter(weapon => weapon.type === 'melee')
    const rangeWeapons = weapons.filter(weapon => weapon.type === 'ranged')
    let abilities = dataBase.data.warscroll_ability.filter(ability => ability.warscrollId === unit.id)
    const regimentOptions = dataBase.data.warscroll_regiment_option.filter(option => option.warscrollId === unit.id)
    const isManifestation = unit.referenceKeywords.includes('Manifestation')
    const manifestationInfo = isManifestation ? dataBase.data.lore_ability.find(ability => ability.linkedWarscrollId === unit.id) : undefined
    const characteristics = [
        {value: unit.move, title: 'Move'},
        {value: unit.health, title: 'Health'},
        {value: unit.control, title: isManifestation ? 'Banish' : 'Control'},
        {value: unit.save, title: 'Save'}
    ]
    if (manifestationInfo) {
        abilities = [...abilities, manifestationInfo]
        characteristics.splice(3, 0, {value: `${manifestationInfo.castingValue}+`, title: 'Cast'})
    }

    const getWeaponAbilities = (weaponId) => {
        const abilitiesIds = dataBase.data.warscroll_weapon_weapon_ability.filter(ability => ability.warscrollWeaponId === weaponId).map(ability => ability.weaponAbilityId)
        const abilities = abilitiesIds.map(abilityId => dataBase.data.weapon_ability.find(wpAbility => wpAbility.id === abilityId))
        return abilities
    }

    const renderCell = (cell) => <p key={cell} id='cell'>{cell}</p>

    const renderWeaponAbility = (ability) => <p id='weaponAbilities'>{ability.name}</p>

    const renderRangeWeapon = (weapon) => {
        const weaponAbilities = getWeaponAbilities(weapon.id)
        const cells = ['Rng', 'A', 'HIT', 'W', 'R', 'D', weapon.range, weapon.attacks, weapon.hit, weapon.wound, weapon.rend, weapon.damage]
        return <>
            <p className='weaponName'>{weapon.name}</p>
            <div className='rangeWeapons'>
                {cells.map(renderCell)}
            </div>
            <div id='row' className='flexContainer'>
                {weaponAbilities.map(renderWeaponAbility)}
            </div>
        </>
    }

    const renderMeleeWeapon = (weapon) => {
        const weaponAbilities = getWeaponAbilities(weapon.id)
        const cells = ['A', 'HIT', 'W', 'R', 'D', weapon.attacks, weapon.hit, weapon.wound, weapon.rend, weapon.damage]
        return <>
            <p className='weaponName'>{weapon.name}</p>
            <div className='meleeWeapons'>
                {cells.map(renderCell)}
            </div>
            <div id='row' className='flexContainer'>
                {weaponAbilities.map(renderWeaponAbility)}
            </div>
        </>
    }

    const renderAbility = (ability) => <Ability key={ability.id} ability={ability} />

    const renderRegimentOption = (option) => <p>&#8226; {option.optionText}</p>

    const renderCharacteristic = (characteristic) => <div id='characteristicSubContainer' style={{width: '20%'}}>
        <p id='characteristicValue'>{characteristic.value}</p>
        <p id='characteristicTitle'>{characteristic.title}</p>
    </div>

    return <>
        <img src={unit.bannerImage} alt={unit.name} width='100%' />
        <div id='warscroll'>
            <h3>Characteristics</h3>
            <div id='characteristicsContainer' className='flexContainer'>
                {characteristics.map(renderCharacteristic)}
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
    </>
}

export default Warscroll