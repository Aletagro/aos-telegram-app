import React from 'react'
import {useNavigate} from 'react-router-dom'
import {singlePlayer} from '../utilities/appState'
import {getNewRound} from '../utilities/utils'
import NewGamePlayer from './NewGamePlayer'
import Button from '../components/Button'

import Styles from './styles/NewGame.module.css'

const NewGame = ({onUpdate}) => {
    const navigate = useNavigate()
    const disabledStartButton = !singlePlayer.battleplan.name
    
    const handleChooseBattleplan = () => {
        navigate('/chooseBattleplan', {state: {title: 'Choose Battleplan'}})
    }

    const handleClickStart = () => {
        // TODO: Добавить валидацию
        singlePlayer.rounds.push(getNewRound(singlePlayer.battleplan))
        singlePlayer.gameStarted = true
        if (singlePlayer.underdog) {
            singlePlayer[singlePlayer.underdog].cp = 5
        }
        onUpdate()
    }

    return <div id='column' className='Chapter'>
        <Button className={Styles.battleplan} type={singlePlayer.battleplan.name ? 'secondary' : 'primary'} onClick={handleChooseBattleplan}>{singlePlayer.battleplan.name ? `Battleplan: ${singlePlayer.battleplan.name}` : 'Choose Battleplan'}</Button>
        <NewGamePlayer player='firstPlayer' onUpdate={onUpdate} />
        <NewGamePlayer player='secondPlayer' onUpdate={onUpdate} />
        <Button className={Styles.start} onClick={handleClickStart} disabled={disabledStartButton}>Start Game</Button>
    </div>
}

export default NewGame