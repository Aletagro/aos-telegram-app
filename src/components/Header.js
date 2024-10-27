import React from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {roster, search} from '../utilities/appState'
import './styles/Header.css'

const Header = () => {
    const navigate = useNavigate()
    const {pathname, state} = useLocation()

    const handleGoBack = () => {
        navigate(-1)
        if (pathname === '/chooseGrandAlliance/chooseFaction/builder') {
            roster.regiments = [{units: [], heroId: '', points: 0}]
            roster.generalRegimentIndex = null
            roster.battleFormation = null
            roster.points = 0
            roster.spellsLore = ''
            roster.prayersLore = ''
            roster.manifestationLore = ''
            roster.factionTerrain = ''
            roster.auxiliaryUnits = []
            roster.regimentsOfRenown = []
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
                return <button type='button' id='headerButton' onClick={handleNavigateToExport}>
                    Export
                </button>
            default:
                return <button type='button' id='headerButton' onClick={handleNavigateToSearch}>
                    Search
                </button>
        }
    }

    return <div className="header" id="myHeader">
        {pathname === '/'
            ? null
            : <button type='button' id='headerButton' onClick={handleGoBack}>
                Back
            </button>
        }
        <p id='headerTitle'>{state?.title}</p>
        {renderRightButton()}
    </div>
}

export default Header