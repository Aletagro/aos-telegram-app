import React from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import BattleTactic from '../components/BattleTactic'

import map from 'lodash/map'
import filter from 'lodash/filter'

import Styles from './styles/BuilderChooseTacticsCard.module.css'

const dataBase = require('../dataBase.json')

const BuilderTactics = () => {
    const {cardId} = useLocation().state
    const navigate = useNavigate()
    const tactics = filter(dataBase.data.battle_tactic, ['battleTacticCardId', cardId])

    const handleGoBack = () => {
        navigate(-1)
    }

    const renderTactic = (tactic) => <BattleTactic key={tactic.id} tactic={tactic}/>

    return  <div id='column' className='Chapter'>
        {map(tactics, renderTactic)}
        <button id={Styles.backButton} onClick={handleGoBack}>Back</button>
    </div>
}

export default BuilderTactics