import React from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {roster} from '../builder/roster'
import './styles/Header.css'

const Header = () => {
    const navigate = useNavigate()
    const {pathname, state} = useLocation()

    const handleGoBack = () => {
        navigate(-1)
        if (pathname === '/chooseGrandAlliance/chooseFaction/builder') {
            roster.regiments = []
            roster.generalRegimentIndex = null
            roster.battleFormation = null
            roster.points = 0
            roster.manifestationLore = ''
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