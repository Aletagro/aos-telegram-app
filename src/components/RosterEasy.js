import {t} from '../utilities/i18n'
import React from 'react'
import Constants from '../Constants'

import map from 'lodash/map'
import size from 'lodash/size'
import filter from 'lodash/filter'
import forEach from 'lodash/forEach'

import Styles from './styles/RosterEasy.module.css'

const dataBase = require('../utilities/db')

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
        <p><b>{unit.modelCount ? `${unit.modelCount * (unit.isReinforced ? 2 : 1)} x` : ''} {unit.name}</b> ({unit.points || unit.regimentOfRenownPointsCost || 0} {t('points')})</p>
        {unit.artefact ? <p>&#8226; {unit.artefact}</p> : null}
        {unit.heroicTrait ? <p>&#8226; {unit.heroicTrait}</p> : null}
        {unit.weaponOptions ? renderWeaponOptions(unit.weaponOptions) : null}
        {unit.marksOfChaos ? <p>{t('• Mark Of Chaos:')} {unit.marksOfChaos}</p> : null}
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
            <p>{t('Regiment')} {index + 1}</p>
            {roster.generalRegimentIndex === index ? <p>{t('General\'s regiment')}</p> : null}
            {map(JSON.parse(regiment)?.units, renderUnit)}
            <br/>
        </div>

    return <div id={Styles.container} onClick={handleClick}>
        <p>{t('Player:')} {roster.lastname} {roster.firstname}</p> 
        <p>{t('List Name:')} {roster.name}</p> 
        <p>{t('Grand Alliance:')} {roster.grand_alliance}</p>
        <p>{t('Faction:')} {roster.allegiance}</p>
        <p>{t('Battle Formation:')} {roster.battle_formation}{points.battleFormation ? ` (${points.battleFormation} ${t('points')})` : null}</p>
        <p>{t('Battle Tactics Cards:')} {tactics[0]}{size(tactics) === 2 ? ` and ${tactics[1]}` : ''}</p>
        <p>{t('Drops:')} {note?.drops}</p>
        {size(auxiliaryUnits) ? <p>{t('Auxiliaries:')} {size(auxiliaryUnits)}</p> : null}
        <br/>
        {roster.spells_lore ? <p>{t('Spell Lore:')} {roster.spells_lore}{points.spellsLore ? ` (${points.spellsLore} ${t('points')})` : null}</p> : null}
        {roster.prayers_lore ? <p>{t('Prayer Lore:')} {roster.prayers_lore}{points.prayersLore ? ` (${points.prayersLore} ${t('points')})` : null}</p> : null}
        {roster.manifestation_lore ? <p>{t('Manifestation Lore:')} {roster.manifestation_lore}{points.manifestations ? ` (${points.manifestations} ${t('points')})` : null}</p> : null}
        {roster.faction_terrain ? <p>{t('Faction Terrain:')} {roster.faction_terrain}{points.terrain ? ` (${points.terrain} ${t('points')})` : null}</p> : null}
        <hr/>
        {map(regiments, renderRegiment)}
        <hr/>
        {size(auxiliaryUnits)
            ? <div>
                <p>{t('Auxiliary Units')}</p>
                {map(auxiliaryUnits, renderUnit)}
                <hr/>
            </div>
            : null
        }
        {roster.regiment_of_renown
            ? <div>
                <p>{t('Regiment Of Renown')}</p>
                {renderUnit(JSON.parse(roster.regiment_of_renown))}
                {map(JSON.parse(roster.regiments_of_renown_units), renderRegimentsOfRenownUnit)}
                <hr/>
            </div>
            : null
        }
        <p>{t('Wounds:')} {note?.wounds}</p>
        <p>{points?.all}/{roster.points_limit} {t('Pts')}</p>
        {note.noteText ? <p>{t('Note:')} {note?.noteText}</p> : null}
        {(roster.last_changes < Constants.fullDatelastUpdate) ? <p id={Styles.warning}>{t('Warning: List created before last update!')}</p> : null}
    </div>
}

export default RosterEasy