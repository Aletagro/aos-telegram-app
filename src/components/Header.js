import React from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {roster} from '../utilities/appState'
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
        }
    }

    const handleNavigateToSearch = () => {navigate('search')}

    return <div className="header" id="myHeader">
        {pathname === '/'
            ? null
            : <button type='button' id='headerButton' onClick={handleGoBack}>
                Back
            </button>
        }
        <p id='headerTitle'>{state?.title}</p>
        {pathname !== '/search'
            ? <button type='button' id='headerButton' onClick={handleNavigateToSearch}>
                Search
            </button>
            : null
        }
    </div>
}

export default Header