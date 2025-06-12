import React, {useCallback, useReducer, useState, useEffect} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import Modal from '@mui/joy/Modal'
import ModalDialog from '@mui/joy/ModalDialog'
import Constants from '../Constants'
import {roster} from '../utilities/appState'
import {getWoundsCount, getInfo} from '../utilities/utils'
import Regiment from './Regiment'
import UnitRow from './UnitRow'
import Row from '../components/Row'
import Add from '../icons/add.svg'
import Info from '../icons/info.svg'
import WhiteInfo from '../icons/whiteInfo.svg'

import map from 'lodash/map'
import size from 'lodash/size'
import flatten from 'lodash/flatten'

import Styles from './styles/Builder.module.css'

const dataBase = require('../dataBase.json')

const spellsIncludesTexts = ['Lore of', 'Spell Lore', 'Arcane']
const preyersIncludesTexts = ['Prayer', 'Bless', 'Rites', 'Warbeats', 'Scriptures', 'Bendictions', 'Gifts of']
const pointsLimits = ['1000', '1500', '2000', '2500', '3000']

const emptyRegiment = {
    units: [],
    heroId: '',
    points: 0,
    artefact: '',
    heroicTrait: ''
}

const Builder = () => {
    const {allegiance, alliganceId} = useLocation().state
    const [open, setOpen] = useState(false)
    const [pointError, setPointError] = useState(false)
    const _alliganceId = alliganceId || allegiance?.id
    const navigate = useNavigate()
    // eslint-disable-next-line
    const [_, forceUpdate] = useReducer((x) => x + 1, 0)
    const warscrollIds = dataBase.data.warscroll_faction_keyword.filter((item) => item.factionKeywordId === _alliganceId).map(item => item.warscrollId)
    const factionTerrains = warscrollIds.map(warscrollId => dataBase.data.warscroll.find(scroll => scroll.id === warscrollId)).filter(unit => !unit.isSpearhead && !unit.isLegends && unit?.referenceKeywords?.includes('Terrain'))
    const lores = dataBase.data.lore.filter(lore => lore.factionId === _alliganceId)
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
    const artefactsGroups = dataBase.data.ability_group.filter(group => group.factionId === _alliganceId && group.abilityGroupType === 'artefactsOfPower')
    const artefacts = flatten(map(artefactsGroups, artefactsGroup => dataBase.data.ability.filter(ability => ability.abilityGroupId === artefactsGroup?.id)))
    const heroicTraitsGroups = dataBase.data.ability_group.filter(group => group.factionId === _alliganceId && group.abilityGroupType === 'heroicTraits')
    const heroicTraits = flatten(map(heroicTraitsGroups, heroicTraitsGroup => dataBase.data.ability.filter(ability => ability.abilityGroupId === heroicTraitsGroup?.id)))
    const battleFormations = dataBase.data.battle_formation.filter(formation => formation.factionId === _alliganceId)

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
    if (!battleFormations.length) {
        roster.withoutBattleFormation = true
    }
    let requiredGeneralId = allegiance?.rosterFactionKeywordRequiredGeneralWarscrollId
    if (!allegiance) {
        requiredGeneralId = dataBase.data.faction_keyword.find(faction => faction.id === _alliganceId)?.rosterFactionKeywordRequiredGeneralWarscrollId
    }
    let requiredGeneral = undefined
    if (requiredGeneralId) {
        requiredGeneral = dataBase.data.warscroll.find(unit => unit.id === requiredGeneralId)
        roster.requiredGeneral = requiredGeneral
    }

    useEffect(() => {
        let hasError = false
        if (roster.pointsLimit - roster.points < 0) {
            hasError = true
        }
        if (hasError !== pointError) {
            setPointError(hasError)
        }
    // eslint-disable-next-line
    }, [roster.points])

    const handleAddRegiment = useCallback(() => {
        roster.regiments = [...roster.regiments, emptyRegiment]
        forceUpdate()
    }, [])

    const handleClickAuxiliaryUnit = (unit) => {
        navigate('/warscroll', {state: {title: unit.name, unit}})
    }

    const handleClickRegimentOfRenown = (regiment) => {
        navigate('/regimentOfRenown', {state: {title: regiment.name, regiment}})
    }

    const handleDeleteAuxiliaryUnit = (unit, index) => {
        roster.auxiliaryUnits.splice(index, 1)
        roster.points = roster.points - unit.points
        forceUpdate()
    }

    const handleDeleteRegimentOfRenown = (regiment, index) => {
        roster.regimentOfRenown = null
        roster.regimentsOfRenownUnits = []
        roster.points = roster.points - regiment.regimentOfRenownPointsCost
        forceUpdate()
    }

    const handleAddAuxiliaryUnit = () => {
        navigate('/addUnit', {state: {
            isAuxiliary: true,
            alliganceId: _alliganceId,
            title: 'Add Auxiliary Unit'
        }})
    }

    const handleAddRegimentsOfRenown = () => {
        navigate('/addUnit', {state: {
            isRegimentsOfRenown: true,
            alliganceId: _alliganceId,
            title: 'Add Regiments Of Renown'
        }})
    }

    const handleChooseEnhancement = (name, type, data, isInfo) => () => {
        if (type === 'factionTerrain' && isInfo) {
            navigate('/warscroll', {state: {unit: data.find(terrain => terrain.name === roster.factionTerrain)}})
        } else {
            navigate('/chooseEnhancement', {state: {title: name, data, type, isRosterInfo: true, isInfo}})
        }
    }

    const handleChooseTactics = () => {
        navigate('/builderChooseTacticsCard', {state: {title: 'Choose Tactics Card'}})
    }

    const handleReinforcedAuxiliary = (unit, unitIndex) => {
        if (unit.isReinforced) {
            const _points = unit.points / 2
            roster.auxiliaryUnits[unitIndex] = {
                ...roster.auxiliaryUnits[unitIndex],
                isReinforced: false,
                points: _points
            }
            roster.points = roster.points - _points
        } else {
            roster.auxiliaryUnits[unitIndex] = {
                ...roster.auxiliaryUnits[unitIndex],
                isReinforced: true,
                points: unit.points * 2
            }
            roster.points = roster.points + unit.points
        }
        forceUpdate()
    }

    const handleClickAllegiance = () => {
        const info = getInfo(Constants.armyEnhancements[0], {id: _alliganceId, name: roster.allegiance})
        navigate('/armyInfo', {state: {title: Constants.armyEnhancements[0].title, info, allegiance: {name: roster.allegiance}}})
    }

    const handleOpenModal = () => {setOpen(true)}

    const handleCloseModal = () => {setOpen(false)}

    const handleClickPointsLimitButton = (limit) => () => {
        roster.pointsLimit = limit
        handleCloseModal()
    }

    const handleClickTactics = (card) => () => {
        navigate('/builderTactics', {state: {title: card.name, cardId: card.id}})
    }

    const renderRegiment = (regiment, index) => <Regiment
        key={index}
        regiment={regiment}
        alliganceId={_alliganceId}
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
        artefacts={artefacts}
        heroicTraits={heroicTraits}
        onReinforced={handleReinforcedAuxiliary}
        alliganceId={_alliganceId}
        withoutMargin
        isAuxiliary
    />

    const renderRegimentOfRenown = () => <UnitRow
        unit={roster.regimentOfRenown}
        onClick={handleClickRegimentOfRenown}
        onDelete={handleDeleteRegimentOfRenown}
        alliganceId={_alliganceId}
        withoutMargin
        withoutCopy
    />

    // RoR с дп может брать артефакты и трейты
    const renderRegimentOfRenownUnit = (unit, index) => roster.regimentOfRenown.id === '11cc4585-4cf5-43eb-af29-e2cbcdb6f5dd'
        ? <UnitRow
            key={unit.id}
            unit={unit}
            onClick={handleClickAuxiliaryUnit}
            unitIndex={index}
            artefacts={artefacts}
            heroicTraits={heroicTraits}
            isRoRUnitWithKeyword
            withoutMargin
            withoutCopy
        />
        : <Row
            key={`${unit.id}-${index}`}
            title={`${unit.modelCount} ${unit.name}`}
            image={unit?.rowImage}
            navigateTo='warscroll'
            state={{unit}}
        />

    const renderManifestation = (manifestation) => <Row
        key={manifestation.id}
        title={manifestation.name}
        image={manifestation.rowImage}
        navigateTo='warscroll'
        state={{unit: manifestation}}
    />

    const renderEnhancement = (name, type, data) => data.length === 1
        ? <div id={Styles.secondAddButton}>
            <button id={Styles.addButtonText} onClick={handleChooseEnhancement(name, type, data)}>
                {data[0].name}
            </button>
            <button id={Styles.infoIcon} onClick={handleChooseEnhancement(name, type, data, true)}><img className={Styles.icon} src={Info} alt="" /></button>
        </div>
        : <div id={Styles.addButton}>
            <button id={Styles.addButtonText} onClick={handleChooseEnhancement(name, type, data)}>
                {roster[type]
                    ? `${name} : ${roster[type]}${type === 'manifestationLore' && roster.manifestationsPoints ? ` (${roster.manifestationsPoints}${Constants.noBreakSpace}pts)` : ''}`
                    : `Choose ${name}`
                }
            </button>
            {type === 'manifestationLore' || !roster[type]
                ? null
                : <button id={Styles.infoIcon} onClick={handleChooseEnhancement(name, type, data, true)}><img src={Info} alt="" /></button>
            }
        </div>
        
    const renderPointsLimitButton = (limit) => <button key={limit} id={Styles.pointsLimitButton} onClick={handleClickPointsLimitButton(limit)}>{limit} Points</button>

    const renderModalContent = () => <>
        <b id={Styles.pointsLimitTitle}>Points Limit</b>
        {pointsLimits.map(renderPointsLimitButton)}
    </>

    return <div id='column' className='Chapter'>
        <button id={Styles.mainInfoContainer} onClick={handleClickAllegiance}>
            <div id={Styles.allegianceContainer}>
                <p id={Styles.text}>Grand Alliance: <b>{roster.grandAlliance}</b></p>
                <img id={Styles.allegianceInfoIcon} src={Info} alt="" />
            </div>
            <p id={Styles.text}>Allegiance: <b>{roster.allegiance}</b></p>
            <p>Wounds: {getWoundsCount(roster)}</p>
        </button>
        <button onClick={handleOpenModal} id={pointError ? Styles.errorPointsContainer : Styles.pointsContainer}>
            <p id={Styles.pointsTitle}>Army: {roster.points}/{roster.pointsLimit} Points ({roster.pointsLimit - roster.points})</p>
            <img id={Styles.pointsTitleInfoIcon} src={WhiteInfo} alt="" />
        </button>
        {battleFormations.length
            ? <button id={roster.battleFormation ? Styles.secondAddButton : Styles.addButton} onClick={handleChooseEnhancement('Battle Formation', 'battleFormation', battleFormations)}>
                {roster.battleFormation
                    ? `Battle Formation : ${roster.battleFormation}`
                    : 'Choose Battle Formation'
                }
            </button>
            : null
        }
        <button id={size(roster.tactics) === 2 ? Styles.secondAddButton : Styles.addButton} onClick={handleChooseTactics}>
            {size(roster.tactics) === 2 ? `Your Tactics Cards` : 'Choose Tactics Cards'}
        </button>
        {roster.tactics[0]
            ? <button onClick={handleClickTactics(roster.tactics[0])} id={Styles.secondAddButton}>
                <p>First Card: {roster.tactics[0].name}</p>
                <img src={Info} alt="" />
            </button>
            : null
        }
        {roster.tactics[1]
            ? <button onClick={handleClickTactics(roster.tactics[1])} id={Styles.secondAddButton}>
                <p>Second Card: {roster.tactics[1].name}</p>
                <img src={Info} alt="" />
            </button>
            : null
        }
        {roster.regiments.length > 0
            ? roster.regiments.map(renderRegiment)
            : null
        }
        {roster.regiments.length < 5
            ? <button id={Styles.addButton} onClick={handleAddRegiment}>
                <p>Add Regiment</p>
                <img src={Add} alt='' />
            </button>
            : null
        }
        <button id={Styles.secondAddButton} onClick={handleAddAuxiliaryUnit}>
            <p>Add Auxiliary Unit</p>
            <img src={Add} alt='' />
        </button>
        {roster.auxiliaryUnits.map(renderAuxiliaryUnit)}
        {roster.regimentOfRenown
            ? <>
                <p id={Styles.title}>Regiment Of Renown</p>
                {renderRegimentOfRenown()}
                {roster.regimentsOfRenownUnits?.map(renderRegimentOfRenownUnit)}
            </>
            : <button id={Styles.secondAddButton} onClick={handleAddRegimentsOfRenown}>
                <p>Add Regiments Of Renown</p>
                <img src={Add} alt='' />
            </button>
        }
        <p id={Styles.title}>Lores</p>
        {spellsLores.length > 0 ? renderEnhancement('Spell Lore', 'spellsLore', spellsLores) : null}
        {preyersLores.length > 0 ? renderEnhancement('Prayer Lore', 'prayersLore', preyersLores) : null}
        {manifestationsLores.length > 0 ? renderEnhancement('Manifestation Lore', 'manifestationLore', manifestationsLores) : null}
        {roster.manifestationsList?.map(renderManifestation)}
        {factionTerrains.length > 0 ? renderEnhancement('Faction Terrain', 'factionTerrain', factionTerrains) : null}
        <Modal open={open} onClose={handleCloseModal}>
            <ModalDialog layout="center">
                {renderModalContent()}
            </ModalDialog>
        </Modal>
    </div>
}

export default Builder