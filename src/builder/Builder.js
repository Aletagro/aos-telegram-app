import React, {useCallback, useReducer} from 'react';
import {useLocation, useNavigate} from 'react-router-dom'
import {roster} from '../utilities/appState'
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

    const handleChooseEnhancement = (name, type, data) => () => {
        navigate('chooseEnhancement', {state: {title: name, data, type, isRosterInfo: true}})
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

    const renderEnhancement = (name, type, data) => data.length === 1
        ? <p id='builderLore'>{name}: <b>{data[0].name}</b></p>
        : <button id='builderAddButton' onClick={handleChooseEnhancement(name, type, data)}>
            {roster[type]
                ? `${name} : ${roster[type]}`
                : `Choose ${name}`
            }
        </button>

    return <div id='column' className='Chapter'>
        <div id='mainInfoContainer'>
            <p id='builderText'>Grand Alliance: {roster.grandAlliance}</p>
            <p id='builderText'>Allegiance: {roster.allegiance}</p>
            <p id='builderText'>{roster.points}/2000 Points</p>
        </div>
        {battleFormations.length > 0
            ? <button id='builderAddButton' onClick={handleChooseEnhancement('Battle Formation', 'battleFormation', battleFormations)}>
                {roster.battleFormation
                    ? `Battle Formation : ${roster.battleFormation}`
                    : 'Choose Battle Formation'
                }
            </button>
            : null
        }
        {roster.regiments.length < 5 ? <button id='builderAddButton' onClick={handleAddRegiment}>Add Regiment</button> : null}
        {roster.regiments.length > 0
            ? roster.regiments.map(renderRegiment)
            : null
        }
        <>
            <button id='builderAddButton' onClick={handleAddAuxiliaryUnit}>Add Auxiliary Unit</button>
            {roster.auxiliaryUnits.map(renderAuxiliaryUnit)}
        </>
        <>
            {roster.regimentsOfRenown.length > 0
                ? <>
                    <p id='builderTitle'>Regiment Of Renown</p>
                    {roster.regimentsOfRenown.map(renderRegimentOfRenown)}
                </>
                : null
            }
            {roster.regimentsOfRenown.length < 1
                ? <button id='builderAddButton' onClick={handleAddRegimentsOfRenown}>Add Regiments Of Renown</button>
                : null
            }
        </>
        <p id='builderTitle'>Lores</p>
        {spellsLores.length > 0 ? renderEnhancement('Spell Lore', 'spellsLore', spellsLores) : null}
        {preyersLores.length > 0 ? renderEnhancement('Prayer Lore', 'prayersLore', preyersLores) : null}
        {manifestationsLores.length > 0 ? renderEnhancement('Manifestation Lore', 'manifestationLore', manifestationsLores) : null}
        {factionTerrains.length > 0 ? renderEnhancement('Faction Terrain', 'factionTerrain', factionTerrains) : null}
    </div>
}

export default Builder