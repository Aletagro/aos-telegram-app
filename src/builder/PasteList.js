import React, {useRef, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import Textarea from '@mui/joy/Textarea'
import Button from '../components/Button'
import InfoNote from '../components/InfoNote'
import {getTextAfter, parseRegiments, getStringAfterDash, getFactionForWHAoS, parseRegimentsForWHAoS, findCommonOptionId, setRosterGrandAlliance, parseListForListbot, cleanBuilder} from '../utilities/utils'
import {roster, navigationState} from '../utilities/appState'
import Constants from '../Constants'

import map from 'lodash/map'
import trim from 'lodash/trim'
import replace from 'lodash/replace'
import find from 'lodash/find'
import last from 'lodash/last'
import size from 'lodash/size'
import sumBy from 'lodash/sumBy'
import split from 'lodash/split'
import filter from 'lodash/filter'
import forEach from 'lodash/forEach'
import compact from 'lodash/compact'
import includes from 'lodash/includes'
import uniq from 'lodash/uniq'
import lowerCase from 'lodash/lowerCase'

import Styles from './styles/PasteList.module.css'

const dataBase = require('../utilities/db')

const spellIncludesTexts = ['Lore of', 'Spell Lore', 'Arcane']
const manifestationsIncludesTexts = ['Lore of the Abyss']

const PasteList = () => {
    const navigate = useNavigate()
    const [rawList, setList] = useState('')
    // Мессенджеры меняют переводы строк и пробелы, поэтому разбираем нормализованный текст
    const list = rawList.replace(/\r/g, '').replace(/\u00a0/g, ' ')
    const [error, setError] = useState('')
    const [warnings, setWarnings] = useState(null)
    // Формат списка определяется автоматически, поэтому источник и нераспознанные юниты хранятся в ref на время разбора
    const sourceRef = useRef('OurApp')
    const unmatchedRef = useRef([])

    const getListbotEnhancements = (enhancements, unitId) => {
        const data = {weaponOptions: {}}
        forEach(enhancements, enhancement => {
            const abilities = filter(dataBase.data.ability, ['name', enhancement])
            const abilityGroups = map(abilities, ability => find(dataBase.data.ability_group, ['id', ability.abilityGroupId]))
            const keyType = find(abilityGroups, group => group.abilityGroupType !== 'spearheadEnhancements')
            if (keyType) {
                let key = ''
                if (keyType.abilityGroupType === 'artefactsOfPower') {
                    key = 'artefact'
                } else if (keyType.abilityGroupType === 'heroicTraits') {
                    key = 'heroicTrait'
                } else {
                    key = keyType.name
                }
                if (key) {
                    data[key] = enhancement
                }
            } else {
                const weaponsArr = filter(dataBase.data.warscroll_weapon, item => includes(enhancement, item.name) && item.warscrollId === unitId)
                const optionsWeapons = map(weaponsArr, item => filter(dataBase.data.option_weapon, ['weaponId', item.id]))
                const optionId = findCommonOptionId(optionsWeapons)
                const optionGroupId = find(dataBase.data.option, ['id', optionId])?.optionGroupId
                if (optionGroupId) {
                    if (!data.weaponOptions[optionGroupId]) {
                        data.weaponOptions[optionGroupId] = {}
                    }
                    forEach(weaponsArr, item => {
                        if (data.weaponOptions[optionGroupId][item.name]) {
                            data.weaponOptions[optionGroupId][item.name] ++
                        } else {
                            data.weaponOptions[optionGroupId][item.name] = 1
                        }
                    })
                }
            }
        })
        return data
    }

    const getWeapons = (weapons, unitId) => {
        const data = {}
        forEach(weapons, weapon => {
            const match = weapon.match(/^(\d+)/)
            if (match) {
                const value = parseInt(match[0], 10)
                const weaponName = trim(weapon.replace(match[0], ''))
                if (weaponName) {
                    const weaponsArr = filter(dataBase.data.warscroll_weapon, item => includes(weaponName, item.name) && item.warscrollId === unitId)
                    const optionsWeapons = map(weaponsArr, item => filter(dataBase.data.option_weapon, ['weaponId', item.id]))
                    const optionId = findCommonOptionId(optionsWeapons)
                    const optionGroupId = find(dataBase.data.option, ['id', optionId])?.optionGroupId
                    if (optionGroupId) {
                        data[optionGroupId] = {}
                        forEach(weaponsArr, item => {
                            data[optionGroupId][item.name] = value
                        })
                    }
                }
            }
        })
        return data
    }

    const normalizeName = (name) => trim(replace(name || '', /\s+/g, ' '))

    const getUnit = (unit) => {
        // В названиях из базы бывают неразрывные пробелы, а в тексте списка (после копирования) обычные
        const _unit = find(dataBase.data.warscroll, warscroll => normalizeName(warscroll.name) === normalizeName(unit.name) && !warscroll.isSpearhead)
        if (!_unit) {
            unmatchedRef.current.push(unit.name)
            return null
        }
        let enhancements = {}
        let weaponOptions = {}
        // Улучшения без типа ("• Silver Wand") и оружие-улучшения определяются по названию; цена в скобках в конце не нужна
        if (size(unit.enhancements)) {
            enhancements = getListbotEnhancements(map(unit.enhancements, name => trim(name.replace(/\s*\(\d+\s*(?:points?|pts)?\)$/, ''))), _unit.id)
        }
        // Оружие из строк "• 2 x Gore-choppa" и оружие-улучшения из списка улучшений складываются вместе
        const {weaponOptions: enhancementWeapons, ...otherEnhancements} = enhancements
        weaponOptions = {...getWeapons(unit.weapons, _unit.id), ...enhancementWeapons}
        return {
            ..._unit,
            ...unit,
            isReinforced: (_unit.cannotBeReinforced || !unit.points) ? false :  _unit.points !== unit.points, 
            modelCount: _unit?.modelCount,
            artefact: unit.Artefact,
            heroicTrait: unit['Heroic Trait'],
            weaponOptions,
            ...otherEnhancements
        }
    }

    const getUnits = (units) => compact(map(units, getUnit))

    const setRegiment = (regiment) => {
        const points = sumBy(regiment, 'points')
        const units = getUnits(regiment)
        return {units, points, heroId: units[0]?.id || ''}
    }

    const setTactic = (tacticsString, isCommaSplit) => {
        if (!tacticsString) {
            return []
        }
        if (isCommaSplit) {
            return split(tacticsString, ', ')
        } else {
            const parts = tacticsString.split(/\s+and\s+/i)
            const matchedParts = []
            // Проверяем комбинации частей, так как "Intercept and Recover" состоит из двух "and"
            for (let i = 0; i < parts.length; i++) {
                for (let j = i + 1; j <= parts.length; j++) {
                    const combined = parts.slice(i, j).join(" and ")
                    if (includes(Constants.tacticsCards, combined)) {
                    matchedParts.push(combined)
                    i = j - 1 // Пропускаем уже проверенные части
                    break
                    }
                }
            }
            return matchedParts
        }
      }

    const getTactic = (tacticName) => {
        const tacticCard = find(dataBase.data.rule_container, (card) => getStringAfterDash(card.title) === tacticName)
        return tacticCard ? {...tacticCard, name: tacticName} : null
    }

    const getRegimentOfRenown = (rorName) => find(dataBase.data.ability_group, ['name', rorName])

    const getRegimentOfRenownUnits = (regimentOfRenownId) => {
        const regimentsOfRenownWarscrollsIds = filter(dataBase.data.ability_group_regiment_of_renown_linked_warscroll, ['abilityGroupId', regimentOfRenownId])
        const regimentsOfRenownUnits = []
        forEach(regimentsOfRenownWarscrollsIds, item => {
            const warscroll = find(dataBase.data.warscroll, ['id', item.warscrollId])
            for (let i = item.maxCount; i > 0; i--) {
                regimentsOfRenownUnits.push(warscroll)
            }
        })
        return regimentsOfRenownUnits
    }

    const getPoints = (allPoints, factionTerrain, prayers, spells, manifestationLore) => {
        if (allPoints) {
            const terrain = find(dataBase.data.warscroll, ['name', factionTerrain])?.points || 0
            const prayersLore = find(dataBase.data.lore, ['name', prayers])?.points || 0
            const spellsLore = find(dataBase.data.lore, ['name', spells])?.points || 0
            const manifestations = find(dataBase.data.lore, ['name', manifestationLore])?.points || 0
            return {all: Number(allPoints), terrain, prayersLore, spellsLore, manifestations}
        }
        return {all: 0}
    }

    const getMetaForListbot = (array) => {
        const meta = {tactics: []}
        forEach(array, string => {
            const _string = split(string, ' (')[0]
            const isTactic = find(dataBase.data.battle_tactic_card, card => lowerCase(card.name) === lowerCase(_string))
            if (isTactic) {
                meta.tactics.push(_string)
            } else {
                const lore = find(dataBase.data.lore, ['name', _string])
                if (lore.publicationId === Constants.manifestationsPublicationId || includes(manifestationsIncludesTexts, lore.name)) {
                    meta.manifestationLore = _string
                } else if (find(spellIncludesTexts, text => includes(lore.name, text))) {
                    meta.spellsLore = _string
                } else {
                    meta.prayersLore = _string
                }
            }
        })
        return meta
    }

    const getPointsForListBot = () => {
        const match = list.match(/(\d+)\/(\d+)pts/)
        return match ? [parseInt(match[1]), parseInt(match[2])] : null
    }

    const getRegimentsForListBot = (data) => {
        let regiments = data
        let auxiliaryUnits = []
        let regimentOfRenown = null
        // Проверяем, есть ли RoR
        forEach(data, (regiment, index) => {
            const isRoR = find(dataBase.data.ability_group, group => group.name === regiment[0].name && group.abilityGroupType === 'regimentOfRenown')
            if (isRoR) {
                regimentOfRenown = isRoR
                // Если после рора есть еще реджимент, то скидыаем его в Auxiliary
                if (data[index + 1]) {
                    auxiliaryUnits = data[index + 1]
                    regiments = data.slice(0, size(data) - 2)
                } else {
                    regiments = data.slice(0, size(data) - 1)
                }
            }
        })
        // Проверяем, есть ли Auxiliary Units
        if (!regimentOfRenown) {
            const lastUnit = find(dataBase.data.warscroll, ['name', last(data)[0].name])
            const isLastUnitHero = includes(lastUnit.referenceKeywords, 'Hero')
            if (!isLastUnitHero || size(data) > 5) {
                auxiliaryUnits = last(data)
                regiments = data.slice(0, size(data) - 1)
            }
        }
        return {regiments, auxiliaryUnits, regimentOfRenown}
    }

    // Фракция по названию боевого построения, если в списке нет строки Faction (например, список скопирован без шапки)
    const getAllegianceFromFormation = (formationLine) => {
        const name = trim(split(formationLine || '', ' (')[0])
        if (!name) {
            return null
        }
        const formation = find(dataBase.data.battle_formation, ['name', name])
        return find(dataBase.data.faction_keyword, ['id', formation?.factionId])?.name || null
    }

    // Название боевого построения без цены в скобках ("Coven of Blood (20 pts)") и его цена из базы
    const getFormation = (text, allegianceId) => {
        const name = trim(split(text || '', ' (')[0])
        const formation = find(dataBase.data.battle_formation, item => item.name === name && item.factionId === allegianceId) || find(dataBase.data.battle_formation, ['name', name])
        return {name, points: formation?.points || 0}
    }

    const getGrandAlliance = (allegiance) => {
        setRosterGrandAlliance(allegiance)
        return roster.grandAlliance
    }

    const handleNavigateUseOurApp = () => {
        const allegiance = getTextAfter(list, 'Faction:') || getAllegianceFromFormation(getTextAfter(list, 'Battle Formation:'))
        const allegianceId = find(dataBase.data.faction_keyword, ['name', allegiance])?.id
        if (allegianceId) {
            const manifestationLore = split(getTextAfter(list, 'Manifestation Lore:'), ' (')[0]
            const manifestationLoreId = find(dataBase.data.lore, ['name', manifestationLore])?.id
            const manifestationSpells = filter(dataBase.data.lore_ability, ['loreId', manifestationLoreId])
            const manifestationsList = map(manifestationSpells, spell => find(dataBase.data.warscroll, ['id', spell.linkedWarscrollId]))
            const splitPoints = split(getTextAfter(list, 'Pts', true), '/')
            const parsedRegiments = parseRegiments(list)
            const regiments = map(parsedRegiments.regiments, setRegiment)
            // В списке без заголовка названия карт могут идти отдельными строками
            const tacticsString = setTactic(getTextAfter(list, 'Battle Tactics Cards:')) || []
            const tacticsFromLines = size(tacticsString) ? tacticsString : compact(map(list.split('\n'), line => find(Constants.tacticsCards, card => card === trim(line))))
            const tactics = compact(map(tacticsFromLines, getTactic))
            const factionTerrain = split(getTextAfter(list, 'Faction Terrain:'), ' (')[0]
            const prayersLore = split(getTextAfter(list, 'Prayer Lore:'), ' (')[0]
            const spellsLore = split(getTextAfter(list, 'Spell Lore:'), ' (')[0]
            const points = getPoints(splitPoints[0], factionTerrain, prayersLore, spellsLore, manifestationLore)

            roster.allegiance = allegiance
            roster.allegianceId = allegianceId
            roster.auxiliaryUnits = getUnits(parsedRegiments.auxiliaryUnits)
            const formation = getFormation(getTextAfter(list, 'Battle Formation:'), allegianceId)
            if (formation.points) points.battleFormation = formation.points
            roster.battleFormation = formation.name
            roster.factionTerrain = factionTerrain
            roster.generalRegimentIndex = parsedRegiments.generalIndex
            roster.grandAlliance = getTextAfter(list, 'Grand Alliance:') || getGrandAlliance(allegiance)
            roster.manifestationLore = manifestationLore
            roster.manifestationsList = manifestationsList
            roster.points = points
            roster.pointsLimit = splitPoints[1] || 2000
            roster.prayersLore = prayersLore
            roster.regimentOfRenown = getRegimentOfRenown(parsedRegiments.regimentOfRenown.name)
            roster.regiments = regiments
            roster.regimentsOfRenownUnits = getUnits(parsedRegiments.regimentOfRenown.units)
            roster.tactics = tactics
            roster.spellsLore = spellsLore
            return {title: allegiance, alliganceId: allegianceId}
        }
        return null
    }

    const handleNavigateUseWHAoS = () => {
        const listInfo = getFactionForWHAoS(list)
        const allegianceId = find(dataBase.data.faction_keyword, ['name', listInfo[1]])?.id
        if (allegianceId) {
            const factionTerrain = split(getTextAfter(list, 'Faction Terrain', false, true), ' (')[0]
            const manifestationLore = split(getTextAfter(list, 'Manifestation Lore -'), ' (')[0]
            const manifestationLoreId = find(dataBase.data.lore, ['name', manifestationLore])?.id
            const manifestationSpells = filter(dataBase.data.lore_ability, ['loreId', manifestationLoreId])
            const manifestationsList = map(manifestationSpells, spell => find(dataBase.data.warscroll, ['id', spell.linkedWarscrollId]))
            const prayersLore = split(getTextAfter(list, 'Prayer Lore -'), ' (')[0]
            const spellsLore = split(getTextAfter(list, 'Spell Lore -'), ' (')[0]
            // "Battle Tactics Cards: A and B" (iOS) или "Battle Tactic Cards: A, B" (Android и новый формат)
            const tacticsString = includes(list, 'Battle Tactics Cards:') ? setTactic(getTextAfter(list, 'Battle Tactics Cards:')) : setTactic(getTextAfter(list, 'Battle Tactic Cards:'), true)
            const tactics = compact(map(tacticsString, getTactic))
            const pointsMatch = list.match(/(\d+)\s*\/\s*(\d+)\s*pts/i)
            const splitPoints = pointsMatch ? [pointsMatch[1], pointsMatch[2]] : []
            const points = getPoints(splitPoints[0], factionTerrain, prayersLore, spellsLore, manifestationLore)
            const parsedRegiments = parseRegimentsForWHAoS(list)
            const regiments = map(parsedRegiments.regiments, setRegiment)
            const regimentOfRenown = getRegimentOfRenown(parsedRegiments.regimentOfRenown.name)

            roster.allegiance = listInfo[1]
            roster.allegianceId = allegianceId
            roster.auxiliaryUnits = getUnits(parsedRegiments.auxiliaryUnits)
            const formation = getFormation(listInfo[2], allegianceId)
            if (formation.points) points.battleFormation = formation.points
            roster.battleFormation = formation.name
            roster.factionTerrain = factionTerrain
            roster.generalRegimentIndex = parsedRegiments.generalIndex
            roster.grandAlliance = listInfo[0] === 'Orruk Warclans' ? 'Destruction' : (getTextAfter(listInfo[0], 'Grand Alliance') || getGrandAlliance(listInfo[1]))
            roster.manifestationLore = manifestationLore
            roster.manifestationsList = manifestationsList
            roster.points = points
            roster.pointsLimit = splitPoints[1] || 2000
            roster.prayersLore = prayersLore
            roster.regimentOfRenown = regimentOfRenown
            roster.regiments = regiments
            roster.regimentsOfRenownUnits = getRegimentOfRenownUnits(regimentOfRenown?.id)
            roster.tactics = tactics
            roster.spellsLore = spellsLore
            return {title: listInfo[1], alliganceId: allegianceId}
        }
        return null
    }

    const handleNavigateUseListbot = () => {
        const allegiance = list.split('\n')[0]
        const allegianceId = find(dataBase.data.faction_keyword, ['name', allegiance])?.id
        if (allegianceId) {
            setRosterGrandAlliance(allegiance)
            const parsedList = parseListForListbot(list)
            const meta = getMetaForListbot(parsedList.meta)
            const tactics = compact(map(meta.tactics, getTactic))
            const manifestationLoreId = find(dataBase.data.lore, ['name', meta.manifestationLore])?.id
            const manifestationSpells = filter(dataBase.data.lore_ability, ['loreId', manifestationLoreId])
            const manifestationsList = map(manifestationSpells, spell => find(dataBase.data.warscroll, ['id', spell.linkedWarscrollId]))
            const splitPoints = getPointsForListBot()
            const points = getPoints(splitPoints[0], parsedList.factionTerrain, meta.prayersLore, meta.spellsLore, meta.manifestationLore)
            const {regiments, auxiliaryUnits, regimentOfRenown} = getRegimentsForListBot(parsedList.regiments)

            roster.allegiance = allegiance
            roster.allegianceId = allegianceId
            roster.auxiliaryUnits = getUnits(auxiliaryUnits)
            const formation = getFormation(list.split('\n')[1], allegianceId)
            if (formation.points) points.battleFormation = formation.points
            roster.battleFormation = formation.name
            roster.factionTerrain = parsedList.factionTerrain
            roster.generalRegimentIndex = parsedList.generalIndex
            roster.manifestationLore = meta.manifestationLore
            roster.manifestationsList = manifestationsList
            roster.points = points
            roster.pointsLimit = splitPoints[1] || 2000
            roster.prayersLore = meta.prayersLore
            roster.regimentOfRenown = regimentOfRenown
            roster.regiments = map(regiments, setRegiment)
            roster.regimentsOfRenownUnits = getRegimentOfRenownUnits(regimentOfRenown?.id)
            roster.tactics = tactics
            roster.spellsLore = meta.spellsLore
            return {title: allegiance, alliganceId: allegianceId}
        }
        return null
    }

    const parsers = {
        OurApp: handleNavigateUseOurApp,
        WHAoS: handleNavigateUseWHAoS,
        Listbot: handleNavigateUseListbot
    }

    // Порядок, в котором пробуются форматы: сначала самый вероятный по признакам текста, остальные - на случай ошибки определения
    const getSourcesOrder = () => {
        if (includes(list, 'Battle Formation:') && includes(list, 'Faction:')) {
            return ['OurApp', 'WHAoS', 'Listbot']
        }
        if (/^[^|\n]+\s*\|\s*[^|\n]+\s*\|\s*[^|\n]+$/m.test(list) || /(Prayer|Spell|Manifestation) Lore -/.test(list) || includes(list, 'Battle Tactic')) {
            return ['WHAoS', 'Listbot', 'OurApp']
        }
        return ['Listbot', 'WHAoS', 'OurApp']
    }

    // Разбор считается удачным, если нашлась армия и хотя бы один юнит из базы
    const isParsed = (result) => Boolean(result) && (sumBy(roster.regiments, regiment => size(regiment.units)) + size(roster.auxiliaryUnits)) > 0

    const parseList = () => {
        for (const key of getSourcesOrder()) {
            cleanBuilder()
            sourceRef.current = key
            unmatchedRef.current = []
            let result = null
            try {
                result = parsers[key]()
            } catch (e) {
                result = null
            }
            if (isParsed(result)) {
                // Если в списке нет строки с общей суммой очков, считаем её сами
                if (!roster.points.all) {
                    const {terrain, prayersLore, spellsLore, manifestations, battleFormation} = roster.points
                    roster.points.all = sumBy(roster.regiments, 'points') + sumBy(roster.auxiliaryUnits, 'points') + sumBy([terrain, prayersLore, spellsLore, manifestations, battleFormation], value => value || 0)
                }
                return result
            }
        }
        cleanBuilder()
        return null
    }

    const openBuilder = (result) => {
        navigationState.isBuilder = true
        navigate('/builder', {state: result})
    }

    const handleImport = () => {
        const result = parseList()
        if (!result) {
            setError('Could not recognize the list. Paste it as it was copied from the app, including the army name and the units.')
            setWarnings(null)
            return
        }
        setError('')
        const notFound = uniq(unmatchedRef.current)
        if (size(notFound)) {
            setWarnings({result, notFound})
        } else {
            openBuilder(result)
        }
    }

    const handleChangeList = (e) => {
        setList(e.target.value)
        setError('')
        setWarnings(null)
    }

    return <div id='column' className='Chapter'>
        <InfoNote title='Paste your army list'>
            <p>Copy a list from the official Warhammer Age of Sigmar app, Listbot or from this app (Export → Copy List) and paste it below. The format is detected automatically.</p>
        </InfoNote>
        <Textarea sx={inputStyles.listName} minRows={6} value={rawList} onChange={handleChangeList} placeholder='Paste List' />
        {error ? <p className={Styles.error}>{error}</p> : null}
        {warnings
            ? <div className={Styles.warnings}>
                <b>List imported with {size(warnings.notFound)} {size(warnings.notFound) === 1 ? 'note' : 'notes'}</b>
                <ul>{map(warnings.notFound, name => <li key={name}>Unit not found and skipped: {name}</li>)}</ul>
            </div>
            : null
        }
        {warnings
            ? <Button className={Styles.goButton} onClick={() => openBuilder(warnings.result)}>Open list</Button>
            : <Button className={Styles.goButton} disabled={!trim(rawList)} onClick={handleImport}>Import list</Button>
        }
    </div>
}

export default PasteList

const inputStyles = {
    listName: {
        '--Textarea-focusedThickness': '2px',
        '--Textarea-focusedHighlight': '#b0953f',
        minHeight: '140px',
        padding: '8px 6px',
        borderRadius: '16px',
        borderColor: '#c9b36a',
        background: '#fff',
        color: '#1d1810',
        fontFamily: 'Minion Pro Regular',
        fontSize: '16px',
        marginBottom: '16px',
        '&:hover': {borderColor: '#b0953f'}
    }
}
