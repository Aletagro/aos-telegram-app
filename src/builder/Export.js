import React, {useState} from 'react';
import {roster} from '../utilities/appState'
import './styles/Export.css'

const Export = () => {
    const [isCopy, setIsCopy] = useState(false)

    const getUnitForExport = (unit) => `${unit.name} (${unit.points || unit.regimentOfRenownPointsCost} points)${unit.artefact ? `\n[Artefact]: ${unit.artefact}` : ''}${unit.heroicTrait ? `\n[Heroic Trait]: ${unit.heroicTrait}` : ''}`

    const getUnitsForExport = (units) => units.map(getUnitForExport).join('\n')

    const getRegimentForExport = (regiment, index) => `Regiment ${index + 1}\n${roster.generalRegimentIndex === index ? "General's regiment\n" : ''}${regiment.units.map(getUnitForExport).join('\n')}\n----`

    const getRegimentsForExport = () => roster.regiments.map(getRegimentForExport).join('\n')

    const handleExportList = () => {
        const test = `
Grand Alliance: ${roster.grandAlliance}
Faction: ${roster.allegiance}
Battle Formation: ${roster.battleFormation}
Drops: ${roster.regiments.length + roster.auxiliaryUnits.length + roster.regimentsOfRenown.length}${roster.auxiliaryUnits.length > 0 ? `\nAuxiliaries: ${roster.auxiliaryUnits.length}` : ''}

${roster.spellsLore ? `Spell Lore: ${roster.spellsLore}` : ''}${roster.prayersLore ? `\nPrayer Lore: ${roster.prayersLore}` : ''}${roster.manifestationLore ? `\nManifestation Lore: ${roster.manifestationLore}` : ''}${roster.factionTerrain ? `\nFaction Terrain: ${roster.factionTerrain}` : ''}
-----
${getRegimentsForExport()}
${roster.regimentsOfRenown.length > 0 ? `Regiment Of Renown\n${getUnitsForExport(roster.regimentsOfRenown)}\n-----` : ''}
${roster.auxiliaryUnits.length > 0 ? `Auxiliary Units\n${getUnitsForExport(roster.auxiliaryUnits)}\n-----` : ''}
${roster.points}/2000 Pts
`
        navigator.clipboard.writeText(test)
        setIsCopy(true)
    }

    const renderUnit = (unit) => <div key={unit.id}>
        <p><b>{unit.name}</b> ({unit.points || unit.regimentOfRenownPointsCost} points)</p>
        {unit.artefact ? <p>&#8226; {unit.artefact}</p> : null}
        {unit.heroicTrait ? <p>&#8226; {unit.heroicTrait}</p> : null}
    </div>

    const renderRegiment = (regiment, index) => <div key={index}>
        <p>Regiment {index + 1}</p>
        {roster.generalRegimentIndex === index ? <p>General's regiment</p> : null}
        {regiment.units.map(renderUnit)}
    </div>

    return <div id='exportListContainer'>
        <div id='exportListButtonContainer'>
            <button id='exportListButton' onClick={handleExportList}>{isCopy ? 'List Copied' : 'Export List'}</button>
        </div>
        <p>Grand Alliance: {roster.grandAlliance}</p>
        <p>Faction: {roster.allegiance}</p>
        <p>Battle Formation: {roster.battleFormation}</p>
        {roster.spellsLore ? <p>Spell Lore: {roster.spellsLore}</p> : null}
        {roster.prayersLore ? <p>Prayer Lore: {roster.prayersLore}</p> : null}
        {roster.manifestationLore ? <p>Manifestation Lore: {roster.manifestationLore}</p> : null}
        {roster.factionTerrain ? <p>Faction Terrain: {roster.factionTerrain}</p> : null}
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
        {roster.regimentsOfRenown.length > 0
            ? <div>
                <p>Regiment Of Renown</p>
                {roster.regimentsOfRenown.map(renderUnit)}
                <hr/>
            </div>
            : null
        }
        <p>{roster.points}/2000 Pts</p>
    </div>
}

export default Export
