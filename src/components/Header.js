import React from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {roster, search} from '../utilities/appState'
import Search from '../icons/search.svg'
import ArrowBack from '../icons/arrowBack.svg'
import Export from '../icons/export.svg'
import './styles/Header.css'

const Header = () => {
    const navigate = useNavigate()
    const {pathname, state} = useLocation()

    const handleGoBack = () => {
        navigate(-1)
        if (pathname === '/lists/chooseGrandAlliance/chooseFaction/builder') {
            roster.regiments = [{units: [], heroId: '', points: 0}]
            roster.generalRegimentIndex = null
            roster.battleFormation = null
            roster.withoutBattleFormation = false
            roster.points = 0
            roster.spellsLore = ''
            roster.prayersLore = ''
            roster.manifestationLore = ''
            roster.factionTerrain = ''
            roster.auxiliaryUnits = []
            roster.regimentOfRenown = null
            roster.battleFormation = ''
        } else if (pathname === '/search') {
            search.value = ''
            search.warscrolls = []
        }
    }

    const handleNavigateToSearch = () => {navigate('search')}

    const handleNavigateToExport = () => {navigate('export', {state: {title: 'Export List'}})}

    const renderRightButton = () => {
        switch (pathname) {
            case '/search':
                return null
            case '/chooseGrandAlliance/chooseFaction/builder':
                return <button id='headerButton' onClick={handleNavigateToExport}><img src={Export} alt='' /></button>
            default:
                return <button id='headerButton' onClick={handleNavigateToSearch}><img src={Search} alt='' /></button>
        }
    }

    return <div className="header" id="myHeader">
        {pathname === '/'
            ? null
            : <button id='headerButton' onClick={handleGoBack}><img src={ArrowBack} alt='' /></button>
        }
        <p id='headerTitle'>{state?.title}</p>
        {renderRightButton()}
    </div>
}

export default Header