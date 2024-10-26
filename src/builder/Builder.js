import React, {useCallback, useReducer} from 'react';
import {useLocation, useNavigate} from 'react-router-dom'
import {roster} from './roster'
import Regiment from './Regiment'
import UnitRow from './UnitRow'
import './styles/Builder.css'

const dataBase = require('../dataBase.json')

const spellsIncludesTexts = ['Lore of', 'Spell Lore', 'Arcane']
const preyersIncludesTexts = ['Prayer', 'Bless', 'Rites', 'Warbeats', 'Scriptures']

const emptyRegiment = {
    units: [],
    heroId: '',
    points: 0,
    artefact: '',
    heroicTrait: ''
}

const Builder = () => {
    const {alligance} = useLocation().state
    const navigate = useNavigate()
    // eslint-disable-next-line
    const [_, forceUpdate] = useReducer((x) => x + 1, 0)
    const warscrollIds = dataBase.data.warscroll_faction_keyword.filter((item) => item.factionKeywordId === alligance.id).map(item => item.warscrollId)
    const factionTerrains = warscrollIds.map(warscrollId => dataBase.data.warscroll.find(scroll => scroll.id === warscrollId)).filter(unit => !unit.isSpearhead && !unit.isLegends && unit?.referenceKeywords?.includes('Terrain'))
    const lores = dataBase.data.lore.filter(lore => lore.factionId === alligance.id)
    const spellsLores = []
    const preyersLores = []
    const manifestationsLores = dataBase.data.lore.filter(lore => lore.factionId === null)
    lores.forEach(lore => {
        if (spellsIncludesTexts.find(text => lore.name.includes(text))) {
            spellsLores.push(lore)
        } else if (preyersIncludesTexts.find(text => lore.name.includes(text))) {
            preyersLores.push(lore)
        } else {
            manifestationsLores.unshift(lore)
        }
    })
    if (spellsLores.length === 1 && !roster.spellsLore) {
        roster.spellsLore = spellsLores[0].name
    }
    if (preyersLores.length === 1 && !roster.prayersLore) {
        roster.prayersLore = preyersLores[0].name
    }
    if (manifestationsLores.length === 1 && !roster.manifestationLore) {
        roster.manifestationLore = manifestationsLores[0].name
    }
    if (factionTerrains.length === 1 && !roster.factionTerrain) {
        roster.factionTerrain = factionTerrains[0].name
    }
    const artefactsGroup = dataBase.data.ability_group.find(group => group.factionId === alligance.id && group.abilityGroupType === 'artefactsOfPower')
    const artefacts = dataBase.data.ability.filter(ability => ability.abilityGroupId === artefactsGroup.id)
    const heroicTraitsGroup = dataBase.data.ability_group.find(group => group.factionId === alligance.id && group.abilityGroupType === 'heroicTraits')
    const heroicTraits = dataBase.data.ability.filter(ability => ability.abilityGroupId === heroicTraitsGroup.id)
    const battleFormations = dataBase.data.battle_formation.filter(formation => formation.factionId === alligance.id)


    const handleAddRegiment = useCallback(() => {
        roster.regiments = [...roster.regiments, emptyRegiment]
        forceUpdate()
    }, [])

    const handleChangeLore = (rosterLoreName) => (e) => {
        roster[rosterLoreName] = e.target.value
        forceUpdate()
    }

    const handleClickAuxiliaryUnit = (unit) => {
        navigate('warscroll', {state: {title: unit.name, unit}})
    }

    const handleClickRegimentOfRenown = (regiment) => {
        navigate('regimentOfRenown', {state: {title: regiment.name, regiment}})
    }

    const handleDeleteAuxiliaryUnit = (unit, index) => {
        roster.auxiliaryUnits.splice(index, 1)
        roster.points = roster.points - unit.points
        forceUpdate()
    }

    const handleDeleteRegimentOfRenown = (regiment, index) => {
        roster.regimentsOfRenown.splice(index, 1)
        roster.points = roster.points - regiment.regimentOfRenownPointsCost
        forceUpdate()
    }

    const handleAddAuxiliaryUnit = () => {
        navigate('addUnit', {state: {
            isAuxiliary: true,
            alliganceId: alligance.id,
            title: 'Add Auxiliary Unit'
        }})
    }

    const handleAddRegimentsOfRenown = () => {
        navigate('addUnit', {state: {
            isRegimentsOfRenown: true,
            alliganceId: alligance.id,
            title: 'Add Regiments Of Renown'
        }})
    }

    const renderRegiment = (regiment, index) => <Regiment
        key={index}
        regiment={regiment}
        alliganceId={alligance.id}
        index={index}
        forceUpdate={forceUpdate}
        artefacts={artefacts}
        heroicTraits={heroicTraits}
    />

    const renderLore = (rosterLoreName) => (lore) => <div key={lore.name}  id='chooseLoreContainer'>
        <p>{lore.name}</p>
        <input
            type='radio'
            name={rosterLoreName}
            value={lore.name}
            checked={lore.name === roster[rosterLoreName]}
            onChange={handleChangeLore(rosterLoreName)}
        />
    </div>

    const renderRadioBlock = (lores, loreType, rosterLoreName) => lores.length === 1
        ? <p>{loreType}: <b>{lores[0].name}</b></p>
        : <div>
            <b>{loreType}</b>
            {lores.map(renderLore(rosterLoreName))}
        </div>

    const renderAuxiliaryUnit = (unit, index) => <UnitRow
        key={index}
        unit={unit}
        onClick={handleClickAuxiliaryUnit}
        onDelete={handleDeleteAuxiliaryUnit}
        unitIndex={index}
    />

    const renderRegimentOfRenown = (regiment, index) => <UnitRow
        key={index}
        unit={regiment}
        onClick={handleClickRegimentOfRenown}
        onDelete={handleDeleteRegimentOfRenown}
        unitIndex={index}
    />

    return <div id='column' className='Chapter'>
        <p>Grand Alliance: {roster.grandAlliance}</p>
        <p>Allegiance: {roster.allegiance}</p>
        <p>{roster.points}/2000 Points</p>
        {battleFormations.length > 0 ? renderRadioBlock(battleFormations, 'Battle Formation', 'battleFormation') : null}
        {roster.regiments.length < 5 ? <button id='addRegimentButton' onClick={handleAddRegiment}>Add Regiment</button> : null}
        {roster.regiments.length > 0
            ? roster.regiments.map(renderRegiment)
            : null
        }
        <div>
            {roster.auxiliaryUnits.map(renderAuxiliaryUnit)}
            <button onClick={handleAddAuxiliaryUnit}>Add Auxiliary Unit</button>
        </div>
        <div>
            {roster.regimentsOfRenown.length > 0
                ? roster.regimentsOfRenown.map(renderRegimentOfRenown)
                : null
            }
            {roster.regimentsOfRenown.length < 1
                ? <button onClick={handleAddRegimentsOfRenown}>Add Regiments Of Renown</button>
                : null
            }
        </div>
        <h4>Lores</h4>
        {factionTerrains.length > 0 ? renderRadioBlock(factionTerrains, 'Faction Terrain', 'factionTerrain') : null}
        {spellsLores.length > 0 ? renderRadioBlock(spellsLores, 'Spell Lore', 'spellsLore') : null}
        {preyersLores.length > 0 ? renderRadioBlock(preyersLores, 'Prayer Lore', 'prayersLore') : null}
        {manifestationsLores.length > 0 ? renderRadioBlock(manifestationsLores, 'Manifestation Lore', 'manifestationLore') : null}
    </div>
}

export default Builder