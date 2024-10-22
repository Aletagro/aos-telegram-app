import React from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import './styles/Header.css'

const Header = () => {
    const navigate = useNavigate()
    const {pathname, state} = useLocation()
    console.log(pathname)

    return <div className="header" id="myHeader">
        {pathname === '/'
            ? null
            : <button type='button' id='headerButton' onClick={() => {navigate(-1)}}>
                Back
            </button>
        }
        <p id='headerTitle'>{state?.title}</p>
        {pathname !== '/search'
            ? <button type='button' id='headerButton' onClick={() => {navigate('search')}}>
                Search
            </button>
            : null
        }
    </div>
}

export default Header