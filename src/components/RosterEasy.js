import React from 'react'
import Constants from '../Constants'

import map from 'lodash/map'
import size from 'lodash/size'
import filter from 'lodash/filter'
import forEach from 'lodash/forEach'

import Styles from './styles/RosterEasy.module.css'

const dataBase = require('../dataBase.json')

const RosterEasy = ({roster, onClick}) => {
    const tactics = JSON.parse(roster.tactics)
    const note = JSON.parse(roster.note)
    const regiments = JSON.parse(roster.regiments)
    const auxiliaryUnits = JSON.parse(roster.auxiliary_units)
    let otherEnhancements = []
    const points = JSON.parse(roster.points)
    const otherEnhancementsGroups = filter(dataBase.data.ability_group, (item) => item.factionId === roster.allegianceId && item.abilityGroupType === 'otherEnhancements')
    if (size(otherEnhancementsGroups)) {
        forEach(otherEnhancementsGroups, otherEnhancementsGroup => {
            const abilities = filter(dataBase.data.ability, ['abilityGroupId', otherEnhancementsGroup.id])
            otherEnhancements.push({name: otherEnhancementsGroup?.name, id: otherEnhancementsGroup?.id, abilities})
        })
    }

    const handleClick = () => {
        if (onClick) {
            onClick(roster)
        }
    }

    const renderWeapon = ([key, value]) => value
        ? <p>&#8226; {value} x {key}</p>
        : null

    const renderWeaponOption = ([key, value]) => {
        return map(Object.entries(value), renderWeapon)
    }

    const renderWeaponOptions = (weaponOptions) => map(Object.entries(weaponOptions), renderWeaponOption)

    const renderUnit = (unit, index) => <div key={`${unit.id}-${index}`}>
        <p><b>{unit.modelCount ? `${unit.modelCount * (unit.isReinforced ? 2 : 1)} x` : ''} {unit.name}</b> ({unit.points || unit.regimentOfRenownPointsCost || 0} points)</p>
        {unit.artefact ? <p>&#8226; {unit.artefact}</p> : null}
        {unit.heroicTrait ? <p>&#8226; {unit.heroicTrait}</p> : null}
        {unit.weaponOptions ? renderWeaponOptions(unit.weaponOptions) : null}
        {unit.marksOfChaos ? <p>&#8226; Mark Of Chaos: {unit.marksOfChaos}</p> : null}
        {map(otherEnhancements, (otherEnhancement) =>
            unit[otherEnhancement?.name] ? <p key={otherEnhancement.id}>&#8226; {otherEnhancement?.name}: {unit[otherEnhancement?.name]}</p> : null
        )}
        {unit.otherWarscrollOption ? <p>&#8226; {unit.otherWarscrollOption}</p> : null}
    </div>

    const renderRegimentsOfRenownUnit = (unit) => <div>
        <p>{unit.modelCount ? `${unit.modelCount} x` : ''} {unit.name}</p>
        {unit.artefact ? <p>&#8226; {unit.artefact}</p> : null}
        {unit.heroicTrait ? <p>&#8226; {unit.heroicTrait}</p> : null}
        {unit.otherWarscrollOption ? <p>&#8226; {unit.otherWarscrollOption}</p> : null}
    </div>

    const renderRegiment = (regiment, index) => <div key={index}>
            <p>Regiment {index + 1}</p>
            {roster.generalRegimentIndex === index ? <p>General's regiment</p> : null}
            {map(JSON.parse(regiment)?.units, renderUnit)}
            <br/>
        </div>

    return <div id={Styles.container} onClick={handleClick}>
        <p>Player: {roster.lastname} {roster.firstname}</p> 
        <p>List Name: {roster.name}</p> 
        <p>Grand Alliance: {roster.grand_alliance}</p>
        <p>Faction: {roster.allegiance}</p>
        <p>Battle Formation: {roster.battle_formation}{points.battleFormation ? ` (${points.battleFormation} points)` : null}</p>
        <p>Battle Tactics Cards: {tactics[0]}{size(tactics) === 2 ? ` and ${tactics[1]}` : ''}</p>
        <p>Drops: {note?.drops}</p>
        {size(auxiliaryUnits) ? <p>Auxiliaries: {size(auxiliaryUnits)}</p> : null}
        <br/>
        {roster.spells_lore ? <p>Spell Lore: {roster.spells_lore}{points.spellsLore ? ` (${points.spellsLore} points)` : null}</p> : null}
        {roster.prayers_lore ? <p>Prayer Lore: {roster.prayers_lore}{points.prayersLore ? ` (${points.prayersLore} points)` : null}</p> : null}
        {roster.manifestation_lore ? <p>Manifestation Lore: {roster.manifestation_lore}{points.manifestations ? ` (${points.manifestations} points)` : null}</p> : null}
        {roster.faction_terrain ? <p>Faction Terrain: {roster.faction_terrain}{points.terrain ? ` (${points.terrain} points)` : null}</p> : null}
        <hr/>
        {map(regiments, renderRegiment)}
        <hr/>
        {size(auxiliaryUnits)
            ? <div>
                <p>Auxiliary Units</p>
                {map(auxiliaryUnits, renderUnit)}
                <hr/>
            </div>
            : null
        }
        {roster.regiment_of_renown
            ? <div>
                <p>Regiment Of Renown</p>
                {renderUnit(JSON.parse(roster.regiment_of_renown))}
                {map(JSON.parse(roster.regiments_of_renown_units), renderRegimentsOfRenownUnit)}
                <hr/>
            </div>
            : null
        }
        <p>Wounds: {note?.wounds}</p>
        <p>{points?.all}/{roster.points_limit} Pts</p>
        {note.noteText ? <p>Note: {note?.noteText}</p> : null}
        {(roster.last_changes < Constants.fullDatelastUpdate) ? <p id={Styles.warning}>Warning: List created before last update!</p> : null}
    </div>
}

export default RosterEasy