import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom'
import Constants from '../Constants'
import {calc} from '../utilities/appState'
import {getValue, replaceAsterisks} from '../utilities/utils'
import Ability from '../components/Ability'
import HeaderImage from '../components/HeaderImage'
import Calculator from '../icons/calculator.svg'

import Styles from './styles/Warscroll.module.css'

const dataBase = require('../dataBase.json')

const Warscroll = () => {
    window.scrollTo(0, 0)
    const navigate = useNavigate()
    const unit = useLocation().state.unit
    const weapons = dataBase.data.warscroll_weapon.filter(weapon => weapon.warscrollId === unit.id)
    const meleeWeapons = weapons.filter(weapon => weapon.type === 'melee')
    const rangeWeapons = weapons.filter(weapon => weapon.type === 'ranged')
    let abilities = dataBase.data.warscroll_ability.filter(ability => ability.warscrollId === unit.id)
    const regimentOptions = dataBase.data.warscroll_regiment_option.filter(option => option.warscrollId === unit.id)
    const isManifestation = unit.referenceKeywords?.includes('Manifestation')
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

    const getWeaponAbilityForCalculator = (abilities, name) => Boolean(abilities.find(ability => ability.name === name))

    const handleNavigateToCalculator = () => {
        const weaponsAbilities = weapons.map(weapon => getWeaponAbilities(weapon.id))
        const weaponsForCalculator = weapons.map((weapon, index) => ({
            name: weapon.name,
            attacks: getValue(weapon.attacks),
            damage: getValue(weapon.damage),
            toHit: Number(weapon.hit[0]),
            toWound: Number(weapon.wound[0]),
            models: Number(unit.modelCount),
            rend: Number(weapon.rend) || 0,
            champion: unit.referenceKeywords?.includes('Champion') && !getWeaponAbilityForCalculator(weaponsAbilities[index], 'Companion'),
            mortal: getWeaponAbilityForCalculator(weaponsAbilities[index], 'Crit (Mortal)'),
            autoWound: getWeaponAbilityForCalculator(weaponsAbilities[index], 'Crit (Auto-wound)'),
            doubleHit: getWeaponAbilityForCalculator(weaponsAbilities[index], 'Crit (2 Hits)'),
            critOn: Constants.critOn[2]
        }))
        calc.units = [{name: unit.name, weapons: weaponsForCalculator}]
        navigate('/calculator', {state: {weapons: weaponsForCalculator, title: 'Damage Calculator'}})
    }

    const renderCellTitle = (cell, index) => <p key={index} id={Styles.cellTitle}>{cell}</p>

    const renderCellValue = (cell, index) => <p key={index} id={Styles.cellValue}>{cell}</p>

    const renderWeaponAbility = (ability) => <p key={ability.name} id={Styles.weaponAbilities}>{ability.name}</p>

    const renderRangeWeapon = (weapon) => {
        const weaponAbilities = getWeaponAbilities(weapon.id)
        const titles = ['Rng', 'Atk', 'Hit', 'Wnd', 'Rnd', 'Dmg']
        const values = [weapon.range, weapon.attacks, weapon.hit, weapon.wound, weapon.rend, weapon.damage]
        return <div key={weapon.id} id={Styles.weaponContainer}>
            <div id={Styles.weaponNameContainer}>
                <p id={Styles.weaponName}>{weapon.name}</p>
            </div>
            <div id={Styles.weaponCharacteristicsContainer}>
                {titles.map(renderCellTitle)}
            </div>
            <div id={Styles.weaponCharacteristicsContainer}>
                {values.map(renderCellValue)}
            </div>
            <div id={Styles.weaponAbilityContainer}>
                {weaponAbilities.map(renderWeaponAbility)}
            </div>
        </div>
    }

    const renderMeleeWeapon = (weapon) => {
        const weaponAbilities = getWeaponAbilities(weapon.id)
        const titles = ['Atk', 'Hit', 'Wnd', 'Rnd', 'Dmg']
        const values = [weapon.attacks, weapon.hit, weapon.wound, weapon.rend, weapon.damage]
        return <div key={weapon.id} id={Styles.weaponContainer}>
            <div id={Styles.weaponNameContainer}>
                <p id={Styles.weaponName}>{weapon.name}</p>
            </div>
            <div id={Styles.weaponCharacteristicsContainer}>
                {titles.map(renderCellTitle)}
            </div>
            <div id={Styles.weaponCharacteristicsContainer}>
                {values.map(renderCellValue)}
            </div>
            <div id={Styles.weaponAbilityContainer}>
                {weaponAbilities.map(renderWeaponAbility)}
            </div>
        </div>
    }

    const renderAbility = (ability) => <Ability key={ability.id} ability={ability} />

    const renderRegimentOption = (option) => <p id={Styles.unitDetailsText} key={option.id}>&#8226; {replaceAsterisks(option.optionText)}</p>

    const renderCharacteristic = (characteristic) => <div key={characteristic.value} id={Styles.characteristicSubContainer} style={{width: '20%'}}>
        <div id={Styles.characteristicValueContainer}>
            <p id={characteristic.value.length > 3 ? Styles.characteristicLongValue : Styles.characteristicValue}>
                {characteristic.value}
            </p>
        </div>
        <p id={Styles.characteristicTitle}>{characteristic.title}</p>
    </div>

    return <>
        <HeaderImage src={unit.bannerImage} alt={unit.name} />
        <div id={Styles.container}>
            <div id={Styles.characteristicsContainer} className={Styles.flexContainer}>
                {characteristics.map(renderCharacteristic)}
            </div>
            {rangeWeapons.length > 0
                ? <>
                    <div id={Styles.weaponTitleContainer}>
                        <h3 id={Styles.warscrollChapterTitle}>Range Weapons</h3>
                        <button id={Styles.calculator} onClick={handleNavigateToCalculator}><img src={Calculator} alt="" /></button>
                    </div>
                    {rangeWeapons.map(renderRangeWeapon)}
                </>
                : null
            }
            {meleeWeapons.length > 0
                ? <>
                    <div id={Styles.weaponTitleContainer}>
                        <h3 id={Styles.warscrollChapterTitle}>Melee Weapons</h3>
                        <button id={Styles.calculator} onClick={handleNavigateToCalculator}><img src={Calculator} alt="" /></button>
                    </div>
                    {meleeWeapons.map(renderMeleeWeapon)}
                </>
                : null
            }
            {abilities.length > 0
                ? <>
                    <h3 id={Styles.warscrollChapterTitle}>Abilities</h3>
                    {abilities.map(renderAbility)}
                </>
                : null
            }
            <div id={Styles.unitDetailsContainer}>
                <p id={Styles.unitDetailsTitle}>Unit Details</p>
                <div id={Styles.unitDetailsSubContainer}>
                    <p id={Styles.unitDetailsText}>{unit.modelCount} model</p>
                    {unit.wargearOptionsText ? <p id={Styles.wargearOptions}>{replaceAsterisks(unit.wargearOptionsText)}</p> : null}
                    {unit.points ? <p id={Styles.unitDetailsText}>{unit.points} points</p> : null}
                    <p id={Styles.unitDetailsText}><b>Base size:</b> {unit.baseSize}</p>
                    {regimentOptions.length > 0
                        ? <>
                            <b>Regiment Options</b>
                            {regimentOptions.map(renderRegimentOption)}
                        </>
                        : null
                    }
                    {unit.notes ? <p id={Styles.unitDetailsText}>Notes: {replaceAsterisks(unit.notes)}</p> : null}
                </div>
            </div>
            {unit.referenceKeywords
                ? <>
                    <p id={Styles.keywords}>Keywords: <b>{unit.referenceKeywords}</b></p>
                </>
                : null
            }
        </div>
    </>
}

export default Warscroll