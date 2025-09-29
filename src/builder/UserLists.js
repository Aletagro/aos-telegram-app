import React, {useCallback, useEffect, useReducer, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {navigationState, roster, main} from '../utilities/appState'
import {getStringAfterDash, checkForOnlyOneInRegiment, cleanBuilder} from '../utilities/utils'
import Modal from '../components/Modal'
import Constants from '../Constants'
import Add from '../icons/add.svg'
import Close from '../icons/whiteClose.svg'

import map from 'lodash/map'
import find from 'lodash/find'
import size from 'lodash/size'
import sumBy from 'lodash/sumBy'
import filter from 'lodash/filter'
import compact from 'lodash/compact'
import forEach from 'lodash/forEach'
import isEmpty from 'lodash/isEmpty'
import includes from 'lodash/includes'
import findIndex from 'lodash/findIndex'

import Styles from './styles/UserLists.module.css'

const dataBase = require('../dataBase.json')

const tg = window.Telegram.WebApp

const UserLists = () => {
    const navigate = useNavigate()
    const user = tg.initDataUnsafe?.user
    const [modalData, setModalData] = useState({visible: false, title: '', text: ''})
    // eslint-disable-next-line
    const [_, forceUpdate] = useReducer((x) => x + 1, 0)
    let newPoints = {all: 0}

    const handleGetLists = useCallback(async () => {
        fetch(`https://aoscom.online/rosters_db/rosters_by_user?tg_id=${user?.id}`)
            .then(response => response.json())
            .then(data => {
                main.rosters = data.rosters
                forceUpdate()
            })
            .catch(error => console.error(error))
      }, [user?.id])

    const handleDeleteList = useCallback(async (listId) => {
        await fetch(`https://aoscom.online/rosters_db/delete_roster?roster_id=${listId}&tg_id=${user?.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': "application/json, text/javascript, /; q=0.01"
            }
        })
            .then(() => {
                handleGetLists()
                toast.success('List deleted', Constants.toastParams)
            })
            .catch(error => console.error(error))
      }, [handleGetLists, user?.id])

      useEffect(() => {
        handleGetLists()
      }, [handleGetLists])

    const handleAddNewRoster = () => {
        cleanBuilder()
        navigate('/chooseGrandAlliance')
    }

    const handlePasteList = () => {
        navigate('/pasteList')
    }

    const getEncantmentsPoints = (unit) => {
        let points = 0
        forEach(unit, key => {
            const abilities = filter(dataBase.data.ability, ['name', key])
            if (!isEmpty(abilities)) {
                const abilityGroups = map(abilities, ability => find(dataBase.data.ability_group, ['id', ability.abilityGroupId]))
                const groupIndex = findIndex(abilityGroups, group => group.abilityGroupType !== 'spearheadEnhancements')
                points += abilities[groupIndex]?.points || 0
            }
        })
        return points
    }

    const getUnits = (units, withPoinsCheck, isRoR) => map(units, (unit) => {
        const _unit = find(dataBase.data.warscroll, ['id', unit.id])
        if (withPoinsCheck && unit.points && _unit.points && unit.points !== _unit.points) {
            let points = unit.points
            if (includes(_unit.referenceKeywords, 'Hero') ) {
                const encantmentsPoints = getEncantmentsPoints(unit)
                if (unit.points !== (_unit.points + encantmentsPoints)) {
                    points = _unit.points + encantmentsPoints
                }
            } else {
                if (unit.isReinforced) {
                    if (unit.points !== (_unit.points * 2)) {
                        points = _unit.points * 2
                    }
                } else if (unit.points !== _unit.points) {
                    points = _unit.points
                }
            }
            if (unit.points !== points && !isRoR) {
                newPoints.all -= unit.points - points
            }
            return {..._unit, ...unit, points}
        } else {
            return {..._unit, ...unit}
        }
    })

    const getTactic = (tacticName) => {
        const tacticCard = find(dataBase.data.rule_container, (card) => getStringAfterDash(card.title) === tacticName)
        return tacticCard ? {...tacticCard, name: tacticName} : null
    }

    const updatePoints = (name, dataName, pointsName) => {
        const namePoints = find(dataBase.data[dataName], ['name', name])?.points || 0
        if (newPoints[pointsName] && !namePoints) {
            newPoints.all -= newPoints[pointsName]
        } else if (!newPoints[pointsName] && namePoints) {
            newPoints.all += namePoints
        }
        newPoints[pointsName] = namePoints
    }

    const checkPoints = (list) => {
        if (list.faction_terrain) {
            updatePoints(list.faction_terrain, 'warscroll', 'terrain')
        }
        if (list.battle_formation) {
            updatePoints(list.battle_formation, 'battle_formation', 'battleFormation')
        }
        if (list.spells_lore) {
            updatePoints(list.spells_lore, 'lore', 'spellsLore')
        }
        if (list.spells_lore) {
            updatePoints(list.prayers_lore, 'lore', 'prayersLore')
        }
        if (list.spells_lore) {
            updatePoints(list.manifestation_lore, 'lore', 'manifestations')
        }
    }

    const handleNavigateToRoster = (list) => () => {
        newPoints = JSON.parse(list.points) || {all: 0}
        const regiments = map(JSON.parse(list.regiments), (regiment) => {
            const _regiment = JSON.parse(regiment)
            const units = getUnits(_regiment.units, true)
            const regimentPoints = sumBy(units, 'points')
            return checkForOnlyOneInRegiment({..._regiment, units, points: regimentPoints}, list.allegiance_id)
        })
        checkPoints(list)
        let tactics = JSON.parse(list.tactics)
        if (size(tactics) > 0) {
            tactics = compact(map(tactics, getTactic))
        }
        roster.id = list.id
        roster.allegiance = list.allegiance
        roster.allegianceId = list.allegiance_id
        roster.auxiliaryUnits = list.auxiliary_units ? getUnits(JSON.parse(list.auxiliary_units), true) : []
        roster.battleFormation = list.battle_formation
        roster.factionTerrain = list.faction_terrain
        roster.generalRegimentIndex = list.general_regiment_index
        roster.grandAlliance = list.grand_alliance
        roster.manifestationLore = list.manifestation_lore
        roster.manifestationsList = list.manifestations_list ? getUnits(JSON.parse(list.manifestations_list)) : []
        roster.points = newPoints
        roster.pointsLimit = list.points_limit
        roster.prayersLore = list.prayers_lore
        roster.regimentOfRenown = list.regiment_of_renown ? find(dataBase.data.ability_group, ['id', JSON.parse(list.regiment_of_renown)?.id]) : null
        roster.regiments = regiments
        roster.regimentsOfRenownUnits = list.regiments_of_renown_units ? getUnits(JSON.parse(list.regiments_of_renown_units), true, true) : []
        roster.tactics = tactics
        roster.spellsLore = list.spells_lore
        roster.isPublic = list.is_public
        roster.note = list.note
        roster.name = list.name
        navigationState.isBuilder = true
        navigate('/builder', {state: {title: list.allegiance, alliganceId: list.allegiance_id}})
    }

    const handleCloseModal = () => {
        setModalData({visible: false, title: '', text: ''})
    }

    const handleClickDelete = (listId) => () => {
        setModalData({visible: true, title: 'Delete roster?', Content: renderDeleteModalContent(listId)})
    }

    const handleDelete = (listId) => () => {
        handleDeleteList(listId)
        handleCloseModal()
    }

    const renderDeleteModalContent = (listId) => () => <div id={Styles.modalButtonContainer}>
        <button id={Styles.modalButton} onClick={handleDelete(listId)}>Yes</button>
        <button id={Styles.modalButton} onClick={handleCloseModal}>No</button>
    </div>

    const renderList = (list) => {
        const army = find(dataBase.data.faction_keyword, ['id', list.allegiance_id])
        return <div id={Styles.listContainer} key={list.id}>
            <div  id={Styles.closeIcon} onClick={handleClickDelete(list.id)}>
                <img src={Close} alt='' />
            </div>
            <button id={Styles.button} onClick={handleNavigateToRoster(list)} key={list.id}>
                <img src={army?.moreInfoImage} alt={army?.name} id={Styles.image} />
                <div id={Styles.textContainer}>
                    <p id={Styles.text}>{list.name}</p>
                    <p id={Styles.text}>{army?.name}</p>
                </div>
            </button>
        </div>
    }

    return  <div id='column' className='Chapter'>
        <button id={Styles.newRosterButton} onClick={handleAddNewRoster}>
            <p>New List</p>
            <img src={Add} alt='' />
        </button>
        <button id={Styles.newRosterButton} onClick={handlePasteList}>
            <p>Paste List</p>
            <img src={Add} alt='' />
        </button>
        {includes(Constants.developersIds, user?.id)
            ? null
            : <p id={Styles.notice}>You can only save {Constants.listsMax} army lists.</p>
        }
        <div id={Styles.buttonContainer}>
            {map(main.rosters, renderList)}
        </div>
        <Modal {...modalData} onClose={handleCloseModal} />
        <ToastContainer />
    </div>
}

export default UserLists
