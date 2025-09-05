import React, {useCallback, useEffect, useReducer, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {navigationState, roster, lists} from '../utilities/appState'
import {getStringAfterDash} from '../utilities/utils'
import RosterEasy from '../components/RosterEasy'
import Modal from '../components/Modal'
import Constants from '../Constants'

import map from 'lodash/map'
import find from 'lodash/find'
import size from 'lodash/size'
import keys from 'lodash/keys'
import filter from 'lodash/filter'
import compact from 'lodash/compact'
import lowerCase from 'lodash/lowerCase'

import Styles from './styles/Lists.module.css'

const dataBase = require('../dataBase.json')

const tg = window.Telegram.WebApp

const Lists = () => {
    const navigate = useNavigate()
    const user = tg.initDataUnsafe?.user
    const [modalData, setModalData] = useState({visible: false, title: '', text: ''})
    // eslint-disable-next-line
    const [_, forceUpdate] = useReducer((x) => x + 1, 0)

    const handleGetLists = useCallback(async (page = 1, withReset) => {
        fetch(`https://aoscom.online/rosters_db/get_some_rosters_per_pages?filters=${JSON.stringify(lists.filters)}&page=${page}`)
            .then(response => response.json())
            .then(data => {
                lists.data = withReset || page === 1 ? data.rosters : [...lists.data, ...data.rosters]
                lists.meta = data.meta
                forceUpdate()
            })
            .catch(error => console.error(error))
    }, [])

    useEffect(() => {
        if (lists.isFirstReq) {
            lists.isFirstReq = false
            handleGetLists()
        }
    }, [handleGetLists])

    const handleClickNextPage = () => {
        handleGetLists(lists.meta?.page + 1)
    }

    const getUnits = (units) => map(units, (unit) => {
        const _unit = find(dataBase.data.warscroll, ['id', unit.id])
        return {..._unit, ...unit}
    })

    const getTactic = (tacticName) => {
        const tacticCard = find(dataBase.data.rule_container, (card) => getStringAfterDash(card.title) === tacticName)
        return tacticCard ? {...tacticCard, name: tacticName} : null
    }

    const handleNavigateToRoster = (list) => {
        const regiments = map(JSON.parse(list.regiments), (regiment) => {
            const _regiment = JSON.parse(regiment)
            const units = getUnits(_regiment.units)
            return {..._regiment, units}
        })
        let tactics = JSON.parse(list.tactics)
        if (size(tactics) > 0) {
            tactics = compact(map(tactics, getTactic))
        }
        roster.id = list.tg_id && user?.id === list.tg_id ? list.id : undefined
        roster.allegiance = list.allegiance
        roster.allegianceId = list.allegiance_id
        roster.auxiliaryUnits = list.auxiliary_units ? getUnits(JSON.parse(list.auxiliary_units)) : []
        roster.battleFormation = list.battle_formation
        roster.factionTerrain = list.faction_terrain
        roster.generalRegimentIndex = list.general_regiment_index
        roster.grandAlliance = list.grand_alliance
        roster.manifestationLore = list.manifestation_lore
        roster.manifestationsList = list.manifestations_list ? getUnits(JSON.parse(list.manifestations_list)) : []
        roster.points = JSON.parse(list.points) || {all: 0}
        roster.pointsLimit = list.points_limit
        roster.prayersLore = list.prayers_lore
        roster.regimentOfRenown = list.regiment_of_renown ? find(dataBase.data.ability_group, ['id', JSON.parse(list.regiment_of_renown)?.id]) : null
        roster.regiments = regiments
        roster.regimentsOfRenownUnits = list.regiments_of_renown_units ? getUnits(JSON.parse(list.regiments_of_renown_units)) : []
        roster.tactics = tactics
        roster.spellsLore = list.spells_lore
        roster.isPublic = list.is_public
        roster.note = list.note
        roster.listName = list.list_name
        navigationState.isBuilder = true
        navigate('/builder', {state: {title: list.allegiance, alliganceId: list.allegiance_id}})
    }

    const handleCloseModal = () => {
        setModalData({visible: false, title: '', text: ''})
    }

    const handleClickFilter = (filter) => () => {
        if (filter.id === 'all') {
            lists.filters = {all: true, points_limit: 2000}
            handleGetLists(1, true)
        } else {
            setModalData({visible: true, title: filter.label, Content: renderModalFilters(filter)})
        }
    }

    const handleClickModalFilter = (key, value) => () => {
        if (lists.filters[key] === value) {
            const newFilters = {...lists.filters}
            delete newFilters[key]
            if (size(keys(newFilters)) === 1) {
                newFilters.all = true
            }
            if (key === 'allegiance') {
                delete newFilters.battle_formation
            }
            lists.filters = newFilters
        } else {
            const newFilters = {...lists.filters, all: false, [key]: value}
            if (key === 'grand_alliance') {
                delete newFilters.allegiance
                delete newFilters.battle_formation
            } else if (key === 'allegiance') {
                delete newFilters.battle_formation
            }
            lists.filters = newFilters
        }
        handleGetLists(1, true)
        handleCloseModal()
    }

    const renderModalFilter = (key) => (value, index) => <p
        key={index}
        id={lists.filters[key] === value ? Styles.selectedModalFilter : Styles.modalFilter}
        onClick={handleClickModalFilter(key, value)}
    >
        {value}
    </p>

    const renderModalFilters = (_filter) => () => {
        let items = _filter.items
        let secondBlockItems = _filter.secondBlockItems
        if (_filter.id === 'allegiance' && lists.filters.grand_alliance) {
            items = Constants[`${lowerCase(lists.filters.grand_alliance)}Faction`]
            secondBlockItems = Constants[`${lowerCase(lists.filters.grand_alliance)}AoRs`]
        } else if (_filter.id === 'battle_formation' && lists.filters.allegiance) {
            const allegianceId = find(dataBase.data.faction_keyword, ['name', lists.filters.allegiance])?.id
            const battleFormations = filter(dataBase.data.battle_formation, ['factionId', allegianceId])
            items = map(battleFormations, 'name')
        }
        return <>
            {map(items, renderModalFilter(_filter.id))}
            {size(secondBlockItems) > 0
                ? <>
                    <p id={Styles.secondBlockTitle}>{_filter.secondBlockTitle}</p>
                    {map(secondBlockItems, renderModalFilter(_filter.id))}
                </>
                : null
            }
        </>
    }

    const renderFilter = (item) => {
        if (item.id === 'battle_formation' && !lists.filters.allegiance) {
            return null
        }
        return <p id={lists.filters[item.id] ? Styles.selectedFilter : Styles.filter} key={item.id} onClick={handleClickFilter(item)}>{item.label}</p>
    }

    const renderFilters = () => <div id={Styles.filters}>
        <div id={Styles.filtersContainer}>
            <style jsx>{`
            div::-webkit-scrollbar {
                display: none; /* Скрываем скроллбар в WebKit-браузерах */
            }
            `}</style>
            {map(filtersData, renderFilter)}
        </div>
    </div>

    const renderList = (list) => {
        return <RosterEasy key={list.id} roster={list} onClick={handleNavigateToRoster} />
    }

    return <>
        {renderFilters()}
        <div id='column' className='Chapter'>
            {size(lists.data) > 0
                ? <>
                    {map(lists.data, renderList)}
                    {lists.meta?.total_pages === lists.meta?.page
                        ? null
                        : <p id={Styles.nextPage} onClick={handleClickNextPage}>Show Next Page</p>
                    }
                </>
                : <p id={Styles.emptyTitle}>Nobody plays this army yet, you can be the first!</p>
            }
        </div>
        <Modal {...modalData} onClose={handleCloseModal} />
    </>
}

export default Lists

const filtersData = [
    {id: 'all', label: 'All'},
    {id: 'grand_alliance', label: 'Grand Alliance', items: ['Chaos', 'Death', 'Destruction', 'Order']},
    {id: 'allegiance', label: 'Allegiance', items: [...Constants.chaosFaction, ...Constants.deathFaction, ...Constants.destructionFaction, ...Constants.orderFaction].sort(), secondBlockTitle: 'Armies of Renown', secondBlockItems: [...Constants.chaosAoRs, ...Constants.deathAoRs, ...Constants.destructionAoRs, ...Constants.orderAoRs].sort()},
    {id: 'battle_formation', label: 'Battle Formation'},
    {id: 'points_limit', label: 'Points Limit', items: ['1000', '1500', '2000', '2500', '3000']}
  ]