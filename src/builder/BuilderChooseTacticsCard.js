import React, {useReducer} from 'react'
import {useNavigate} from 'react-router-dom'
import {roster} from '../utilities/appState'
import Checkbox from '../components/Checkbox'

import map from 'lodash/map'
import find from 'lodash/find'
import size from 'lodash/size'
import filter from 'lodash/filter'

import Styles from './styles/BuilderChooseTacticsCard.module.css'

const dataBase = require('../dataBase.json')

const BuilderChooseTacticsCard = () => {
    // eslint-disable-next-line
    const [_, forceUpdate] = useReducer((x) => x + 1, 0)
    const navigate = useNavigate()
    const tacticsCard = dataBase.data.battle_tactic_card

    const handleGoBack = () => {
        navigate(-1)
    }

    const handleClickCard = (card) => () => {
        navigate('/builderTactics', {state: {title: card.name, cardId: card.id}})
    }

    const handleClickCheckbox = (card, isChecked) => () => {
        let newTactics = [...roster.tactics]
        if (isChecked) {
            newTactics = filter(roster.tactics, tactic => tactic.id !== card.id)
        } else if (size(newTactics) !== 2) {
            newTactics.push(card)
        }
        roster.tactics = newTactics
        forceUpdate()
    }

    const renderTacticsCard = (card) => {
        const isChecked = find(roster.tactics, ['id', card.id])
        return <div key={card.id} id={Styles.cardContainer}>
            <b id={Styles.name} onClick={handleClickCard(card)}>{card.name}</b>
            <div id={Styles.checkbox}>
                <Checkbox onClick={handleClickCheckbox(card, isChecked)} checked={isChecked} />
            </div>
        </div>
    }

    return  <div id='column' className='Chapter'>
        {map(tacticsCard, renderTacticsCard)}
        <button id={Styles.backButton} onClick={handleGoBack}>Back</button>
    </div>
}

export default BuilderChooseTacticsCard