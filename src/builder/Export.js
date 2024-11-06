import React, {useState} from 'react';
import {roster} from '../utilities/appState'
import {getErrors, getWarnings} from '../utilities/utils'
import './styles/Export.css'

const Export = () => {
    const [isCopy, setIsCopy] = useState(false)
    const errors = getErrors(roster)
    const warnings = getWarnings(roster)

    const getErrorText = (error) => `- ${error}`

    const getErrorsText = (_errors) => _errors.map(getErrorText).join('\n')

    const getUnitForExport = (unit) => `${unit.modelCount ? `${unit.modelCount * (unit.isReinforced ? 2 : 1)} x` : ''} ${unit.name} (${unit.points || unit.regimentOfRenownPointsCost || 0} points)${unit.artefact ? `\n[Artefact]: ${unit.artefact}` : ''}${unit.heroicTrait ? `\n[Heroic Trait]: ${unit.heroicTrait}` : ''}${unit.weaponOptions ? `${getWeaponOptionsForExport(unit)}` : ''}${unit.marksOfChaos ? `\n• ${unit.marksOfChaos}` : ''}${unit.otherWarscrollOption ? `\n• ${unit.otherWarscrollOption}` : ''}`

    const getUnitsForExport = (units) => units.map(getUnitForExport).join('\n')

    const getWeaponForExport = ([key, value]) => value
        ? `\n• ${value} x ${key}`
        : ''

    const getWeaponOptionForExport = ([key, value]) => {
        return Object.entries(value).map(getWeaponForExport)
    }

    const getWeaponOptionsForExport = (unit) => {
        const text = Object.entries(unit.weaponOptions).map(getWeaponOptionForExport)
        return `${text}`.replace(/,/g, '')
    }

    const getRegimentForExport = (regiment, index) => `Regiment ${index + 1}\n${roster.generalRegimentIndex === index ? "General's regiment\n" : ''}${regiment.units.map(getUnitForExport).join('\n')}\n----`

    const getRegimentsForExport = () => roster.regiments.map(getRegimentForExport).join('\n')

    const handleExportList = () => {
        const rosterText = `${errors.length > 0 ? `Roster errors:\n${getErrorsText(errors)}\n\n` : ''}${warnings.length > 0 ? `Roster warnings:\n${getErrorsText(warnings)}\n\n` : ''}Grand Alliance: ${roster.grandAlliance}
Faction: ${roster.allegiance}
Battle Formation: ${roster.battleFormation}
Drops: ${roster.regiments.length + roster.auxiliaryUnits.length + (roster.regimentOfRenown ? 1 : 0)}${roster.auxiliaryUnits.length > 0 ? `\nAuxiliaries: ${roster.auxiliaryUnits.length}` : ''}

${roster.spellsLore ? `Spell Lore: ${roster.spellsLore}` : ''}${roster.prayersLore ? `\nPrayer Lore: ${roster.prayersLore}` : ''}${roster.manifestationLore ? `\nManifestation Lore: ${roster.manifestationLore}` : ''}${roster.factionTerrain ? `\nFaction Terrain: ${roster.factionTerrain}` : ''}
-----
${getRegimentsForExport()}
${roster.regimentOfRenown ? `Regiment Of Renown\n${getUnitForExport(roster.regimentOfRenown)}\n-----` : ''}
${roster.auxiliaryUnits.length > 0 ? `Auxiliary Units\n${getUnitsForExport(roster.auxiliaryUnits)}\n-----` : ''}
Wounds: ${getWoundsCount()}
${roster.points}/2000 Pts
`
        navigator.clipboard.writeText(rosterText)
        console.log(rosterText)
        setIsCopy(true)
    }

    const getWoundsCount = () => {
        let woundsCount = 0
        roster.regiments.forEach(regiment => {
            regiment.units.forEach(unit => {
                woundsCount = woundsCount + (unit.modelCount * (unit.isReinforced ? 2 : 1) * unit.health)
            })
        })
        if (roster.auxiliaryUnits.length > 0) {
            roster.auxiliaryUnits.forEach(unit => {
                woundsCount = woundsCount + (unit.modelCount * (unit.isReinforced ? 2 : 1) * unit.health)
            })
        }
        if (roster.regimentOfRenown) {
            roster.regimentsOfRenownUnits.forEach(unit => {
                woundsCount = woundsCount + (unit.modelCount * (unit.isReinforced ? 2 : 1) * unit.health)
            })
        }
        return woundsCount
    }

    const renderWeapon = ([key, value]) => value
        ? <p>&#8226; {value} x {key}</p>
        : null

    const renderWeaponOption = ([key, value]) => {
        return Object.entries(value).map(renderWeapon)
    }

    const renderWeaponOptions = (weaponOptions) => Object.entries(weaponOptions).map(renderWeaponOption)

    const renderUnit = (unit, index) => <div key={`${unit.id}-${index}`}>
        <p><b>{unit.modelCount ? `${unit.modelCount * (unit.isReinforced ? 2 : 1)} x` : ''} {unit.name}</b> ({unit.points || unit.regimentOfRenownPointsCost || 0} points)</p>
        {unit.artefact ? <p>&#8226; {unit.artefact}</p> : null}
        {unit.heroicTrait ? <p>&#8226; {unit.heroicTrait}</p> : null}
        {unit.weaponOptions ? renderWeaponOptions(unit.weaponOptions) : null}
        {unit.marksOfChaos ? <p>&#8226; Mark Of Chaos: {unit.marksOfChaos}</p> : null}
        {unit.otherWarscrollOption ? <p>&#8226; {unit.otherWarscrollOption}</p> : null}
    </div>

    const renderRegimentsOfRenownUnit = (unit) => <p key={unit.id}>{unit.name}</p>

    const renderRegiment = (regiment, index) => <div key={index}>
        <p>Regiment {index + 1}</p>
        {roster.generalRegimentIndex === index ? <p>General's regiment</p> : null}
        {regiment.units.map(renderUnit)}
    </div>

    const renderError = (error, index) => <p id='exportError'>&#8226; {error}</p>

    const renderWarning = (error, index) => <p  id='exportWarning'>&#8226; {error}</p>

    return <div id='exportListContainer'>
        <div id='exportListButtonContainer'>
            <button id='exportListButton' onClick={handleExportList}>{isCopy ? 'List Copied' : 'Export List'}</button>
        </div>
        {errors.length > 0
            ? <div id='errorsContainer'>
                <p id='exportError'>Roster errors:</p>
                {errors?.map(renderError)}
            </div>
            : null
        }
        {warnings.length > 0
            ? <div id='warningsContainer'>
                <p id='exportWarning'>Roster warnings:</p>
                {warnings?.map(renderWarning)}
            </div>
            : null
        }
        <p id='exportText'>Grand Alliance: {roster.grandAlliance}</p>
        <p id='exportText'>Faction: {roster.allegiance}</p>
        <p id='exportText'>Battle Formation: {roster.battleFormation}</p>
        <p id='exportText'>Drops: {roster.regiments.length + roster.auxiliaryUnits.length + (roster.regimentOfRenown ? 1 : 0)}</p>
        {roster.auxiliaryUnits.length > 0 ? <p id='exportText'>Auxiliaries: {roster.auxiliaryUnits.length}</p> : null}
        <br/>
        {roster.spellsLore ? <p id='exportText'>Spell Lore: {roster.spellsLore}</p> : null}
        {roster.prayersLore ? <p id='exportText'>Prayer Lore: {roster.prayersLore}</p> : null}
        {roster.manifestationLore ? <p id='exportText'>Manifestation Lore: {roster.manifestationLore}</p> : null}
        {roster.factionTerrain ? <p id='exportText'>Faction Terrain: {roster.factionTerrain}</p> : null}
        <hr/>
        {roster.regiments.map(renderRegiment)}
        <hr/>
        {roster.auxiliaryUnits.length > 0
            ? <div>
                <p>Auxiliary Units</p>
                {roster.auxiliaryUnits.map(renderUnit)}
                <hr/>
            </div>
            : null
        }
        {roster.regimentOfRenown
            ? <div>
                <p>Regiment Of Renown</p>
                {renderUnit(roster.regimentOfRenown)}
                {roster.regimentsOfRenownUnits?.map(renderRegimentsOfRenownUnit)}
                <hr/>
            </div>
            : null
        }
        <p>Wounds: {getWoundsCount()}</p>
        {roster.regimentsOfRenownUnits?.length > 1 ? <h6 id='note'>The number of wounds may contain an error due to Regiment Of Renown</h6> : null}
        <p>{roster.points}/2000 Pts</p>
    </div>
}

export default Export
