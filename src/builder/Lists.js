import React from 'react';
import {useNavigate} from 'react-router-dom';
import './styles/Lists.css'

const lists = [
    {
        id: 1,
        name: 'Тестовый листец',
        allegiance: 'Slaves to Darkness',
        alliganceId: 'f2b2d0ce-c458-4f7e-8c57-3f525d345df1'
    },
    {
        id: 2,
        name: 'Слейвы имба',
        allegiance: 'Slaves to Darkness',
        alliganceId: 'f2b2d0ce-c458-4f7e-8c57-3f525d345df1'
    }
]

const ChooseGrandAlliance = () => {
    const navigate = useNavigate()

    const handleClick = ({grandAlliance}) => {
        navigate('chooseGrandAlliance')
    }

    const handleNavigateToRoster = (list) => () => {
        navigate('builder', {state: {alliganceId: list.alliganceId, rosterId: list.id}})
    }

    const renderList = (list) => <button id='builderListButton' onClick={handleNavigateToRoster(list)} key={list.id}>
        <p>{list.name}</p>
        <p>{list.army}</p>
    </button>

    return  <div id='column' className='Chapter'>
        <button id='builderListButton' onClick={handleClick}>New Roster</button>
        {lists.map(renderList)}
    </div>
}

export default ChooseGrandAlliance