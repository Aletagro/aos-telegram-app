import React from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {roster, search, navigationState, isCollapseUnitsTypes, isCollapseRegimentAlliances} from '../utilities/appState'
import Constants from '../Constants'
import Search from '../icons/search.svg'
import ArrowBack from '../icons/arrowBack.svg'
import Export from '../icons/export.svg'
import Home from '../icons/home.svg'

import forEach from 'lodash/forEach'

import Styles from './styles/Header.module.css'

const Header = () => {
    const navigate = useNavigate()
    const {pathname, state} = useLocation()

    const clearCollapseUnitsType = (_, key) => {
        isCollapseUnitsTypes[key] = false
    }

    const clearCollapseRegimentAlliance = (_, key) => {
        isCollapseRegimentAlliances[key] = false
    }

    const clearAppState = () => {
        if (pathname === '/builder') {
            roster.auxiliaryUnits = []
            roster.battleFormation = ''
            roster.factionTerrain = ''
            roster.generalRegimentIndex = null
            roster.manifestationLore = ''
            roster.manifestationsList = []
            roster.points = 0
            roster.pointsLimit = 2000
            roster.prayersLore = ''
            roster.regimentOfRenown = null
            roster.regiments = [{units: [], heroId: '', points: 0}]
            roster.regimentsOfRenownUnits = []
            roster.requiredGeneral = null
            roster.spellsLore = ''
            roster.withoutBattleFormation = false
            navigationState.isBuilder = false
        } else if (pathname === '/search') {
            search.value = ''
            search.Warscrolls = []
            search.Rules = []
            search.Allegiances = []
        } else if (pathname === '/units') {
            forEach(Constants.defaultIsCollapseUnitsTypes, clearCollapseUnitsType)
        } else if (pathname === '/regimentOfRenownList') {
            forEach(Constants.defaultIsCollapseRegimentAlliances, clearCollapseRegimentAlliance)
        }
    }

    const handleGoBack = () => {
        navigate(-1)
        clearAppState()
    }

    const handleNavigateToSearch = () => {navigate('search')}

    const handleNavigateToExport = () => {navigate('export', {state: {title: 'Export List'}})}

    const handleNavigateToHome = () => {
        navigate('/')
        clearAppState()
    }

    const renderRightButton = () => {
        switch (pathname) {
            case '/search':
                return null
            case '/builder':
                return <button id={Styles.rightButton} onClick={handleNavigateToExport}><img src={Export} alt='' /></button>
            default:
                return <div id={Styles.rightButtons}>
                    <button id={Styles.rightButton} onClick={handleNavigateToSearch}><img src={Search} alt='' /></button>
                    {pathname === '/' || pathname === '/export' || navigationState.isBuilder
                        ? null
                        : <button id={Styles.rightButton} onClick={handleNavigateToHome}><img src={Home} alt='' /></button>
                    }
                </div>
        }
    }

    return <div id={Styles.header}>
        {pathname === '/'
            ? null
            : <button id={Styles.leftButton} onClick={handleGoBack}><img src={ArrowBack} alt='' /></button>
        }
        <p id={Styles.title}>{state?.title}</p>
        {renderRightButton()}
    </div>
}

export default Header