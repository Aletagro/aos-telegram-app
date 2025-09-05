import React, {useCallback, useEffect, useReducer, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {navigationState, roster, main} from '../utilities/appState'
import {getStringAfterDash} from '../utilities/utils'
import Modal from '../components/Modal'
import Constants from '../Constants'
import Add from '../icons/add.svg'
import Close from '../icons/whiteClose.svg'

import map from 'lodash/map'
import find from 'lodash/find'
import size from 'lodash/size'
import compact from 'lodash/compact'

import Styles from './styles/UserLists.module.css'

const dataBase = require('../dataBase.json')

const tg = window.Telegram.WebApp

const UserLists = () => {
    const navigate = useNavigate()
    const user = tg.initDataUnsafe?.user
    const [modalData, setModalData] = useState({visible: false, title: '', text: ''})
    // eslint-disable-next-line
    const [_, forceUpdate] = useReducer((x) => x + 1, 0)

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
        navigate('/chooseGrandAlliance')
    }

    const handlePasteList = () => {
        navigate('/pasteList')
    }

    const getUnits = (units) => map(units, (unit) => {
        const _unit = find(dataBase.data.warscroll, ['id', unit.id])
        return {..._unit, ...unit}
    })

    const getTactic = (tacticName) => {
        const tacticCard = find(dataBase.data.rule_container, (card) => getStringAfterDash(card.title) === tacticName)
        return tacticCard ? {...tacticCard, name: tacticName} : null
    }

    const handleNavigateToRoster = (list) => () => {
        const regiments = map(JSON.parse(list.regiments), (regiment) => {
            const _regiment = JSON.parse(regiment)
            const units = getUnits(_regiment.units)
            return {..._regiment, units}
        })
        let tactics = JSON.parse(list.tactics)
        if (size(tactics) > 0) {
            tactics = compact(map(tactics, getTactic))
        }
        roster.id = list.id
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
        <p id={Styles.notice}>You can only save 3 army lists.</p>
        <div id={Styles.buttonContainer}>
            {map(main.rosters, renderList)}
        </div>
        <Modal {...modalData} onClose={handleCloseModal} />
        <ToastContainer />
    </div>
}

export default UserLists
