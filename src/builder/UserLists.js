import {t} from '../utilities/i18n'
import React, {useCallback, useEffect, useReducer, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {navigationState, main} from '../utilities/appState'
import {cleanBuilder} from '../utilities/utils'
import {loadListToRoster} from '../utilities/loadList'
import Modal from '../components/Modal'
import Constants from '../Constants'
import Button from '../components/Button'
import InfoNote from '../components/InfoNote'
import {isSupporter, getSupportUntil, formatSupportDate, openSupportPage} from '../utilities/support'
import {ModalActions, ModalButton} from '../components/ModalActions'

import map from 'lodash/map'
import find from 'lodash/find'
import includes from 'lodash/includes'

import Styles from './styles/UserLists.module.css'

const dataBase = require('../utilities/db')

const UserLists = () => {
    const navigate = useNavigate()
    const [modalData, setModalData] = useState({visible: false, title: '', text: ''})
    // eslint-disable-next-line
    const [_, forceUpdate] = useReducer((x) => x + 1, 0)

    const handleGetLists = useCallback(async () => {
        const urlQuery = main.tgId ? `tgId=${main.tgId}` : `vkId=${main.vkId}`
        fetch(`${Constants.domain}/rosters_db/rosters_by_user?${urlQuery}`)
            .then(response => response.json())
            .then(data => {
                main.rosters = data.rosters
                forceUpdate()
            })
            .catch(error => console.error(error))
      }, [])

    const handleDeleteList = useCallback(async (listId) => {
        await fetch(`${Constants.domain}/rosters_db/delete_roster?roster_id=${listId}&user_id=${main.user?.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': "application/json, text/javascript, /; q=0.01"
            }
        })
            .then(() => {
                handleGetLists()
                toast.success(t('List deleted'), Constants.toastParams)
            })
            .catch(error => console.error(error))
      }, [handleGetLists])

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

    const handleNavigateToRoster = (list) => () => {
        loadListToRoster(list)
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

    const renderDeleteModalContent = (listId) => () => <ModalActions>
        <ModalButton onClick={handleCloseModal}>{t('No')}</ModalButton>
        <ModalButton type='danger' onClick={handleDelete(listId)}>{t('Yes')}</ModalButton>
    </ModalActions>

    const renderList = (list) => {
        const army = find(dataBase.data.faction_keyword, ['id', list.allegiance_id])
        return <div id={Styles.listContainer} key={list.id}>
            <button type='button' className={Styles.closeIcon} onClick={handleClickDelete(list.id)} aria-label={t('Delete list')}>
                <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='3' strokeLinecap='round' aria-hidden='true'><path d='M6 6l12 12M18 6L6 18' /></svg>
            </button>
            <button id={Styles.button} onClick={handleNavigateToRoster(list)} key={list.id}>
                <img src={army?.moreInfoImage} alt={army?.name} id={Styles.image} />
                <div id={Styles.textContainer}>
                    <p id={Styles.text}>{list.name}</p>
                    <p id={Styles.armyText}>{army?.name}</p>
                </div>
            </button>
        </div>
    }

    const renderLimitNote = () => {
        if (includes(Constants.developersIds, main.tgId)) {
            return null
        }
        if (isSupporter(main.user)) {
            return <InfoNote title={t('Thank you for your support!')}>{t('No limit on saved lists until')} {formatSupportDate(getSupportUntil(main.user))}.</InfoNote>
        }
        return <InfoNote title={`You can save up to ${Constants.listsMax} army lists`}>
            <p className={Styles.limitText}>{t('Support the app with any donation from 1 EUR and the limit is removed for a month.')}</p>
            <Button className={Styles.limitButton} size='sm' onClick={openSupportPage}>{t('Support the app')}</Button>
        </InfoNote>
    }

    return  <div id='column' className='Chapter'>
        <Button className={Styles.newRosterButton} onClick={handleAddNewRoster}>{t('New List')}</Button>
        <Button className={Styles.newRosterButton} type='secondary' onClick={handlePasteList}>{t('Paste List')}</Button>
        {renderLimitNote()}
        <div id={Styles.buttonContainer}>
            {map(main.rosters, renderList)}
        </div>
        <Modal {...modalData} onClose={handleCloseModal} />
        <ToastContainer />
    </div>
}

export default UserLists
