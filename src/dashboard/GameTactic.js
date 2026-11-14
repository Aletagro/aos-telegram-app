import {t} from '../utilities/i18n'
import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import InfoIcon from '../icons/InfoIcon'
import {getTacticProgress, canScoreTactic, isTacticsBlocked, scoreTactic, unscoreTactic, getTurnInfo} from './gameModel'
import Constants from '../Constants'
import {getStringAfterDash, replaceAsterisks} from '../utilities/utils'

import map from 'lodash/map'
import find from 'lodash/find'

import Styles from './styles/GameScreen.module.css'

const dataBase = require('../utilities/db')

const STAGE_LABEL = {affray: t('Affray'), strike: t('Strike'), domination: t('Domination')}

// Карточка тактики игрока: три стадии по порядку. Отметка справа у стадии: можно отметить только следующую, снять только последнюю.
// Нажатие на название стадии раскрывает её правила, «i» в заголовке открывает карточку целиком
const GameTactic = ({game, index, cardId, apply}) => {
    const navigate = useNavigate()
    const [open, setOpen] = useState(null)
    const progress = getTacticProgress(game, index, cardId)
    if (!progress) return null
    const active = getTurnInfo(game).playerIndex === index
    const doneStages = progress.stages.filter(stage => stage.done)
    const lastDone = doneStages[doneStages.length - 1]
    const canScore = canScoreTactic(game, index, cardId)
    const scoredThisTurn = active && !canScore && !!progress.next && !!find(doneStages, ['turn', game.turn])

    const openCard = () => {
        const tactic = find(dataBase.data.rule_container, container => getStringAfterDash(container.title) === progress.card.name)
        if (tactic) navigate('/tactic', {state: {title: progress.card.name, tactic}})
    }

    const handleCheck = (stage) => {
        if (stage.done && lastDone === stage) apply(current => unscoreTactic(current, index, cardId))
        else if (stage.type === progress.next && canScore) apply(current => scoreTactic(current, index, cardId))
    }

    const renderStage = (stage) => {
        const isNext = stage.type === progress.next
        const isLast = stage.done && lastDone === stage
        const enabled = active && ((isNext && canScore) || (isLast && stage.turn === game.turn))
        const rules = find(dataBase.data.battle_tactic, ['id', stage.id])?.rulesText
        const expanded = open === stage.type
        const color = Constants.tacticsTypes[stage.type]
        return <div key={stage.type} className={`${Styles.stageRow} ${stage.done ? Styles.stageRowDone : ''} ${isNext ? Styles.stageRowNext : ''}`} style={{borderColor: color}}>
            <div className={Styles.stageMain} style={{backgroundColor: color}}>
                <button type='button' className={Styles.stageBody} onClick={() => setOpen(expanded ? null : stage.type)} aria-expanded={expanded}>
                    <span className={Styles.stageType}>{STAGE_LABEL[stage.type]}{stage.done ? ` · round ${stage.round}` : ' · 5 VP'}</span>
                    <span className={Styles.stageTitle}>{stage.name}<span className={`${Styles.stageChevron} ${expanded ? Styles.stageChevronOpen : ''}`} aria-hidden='true' /></span>
                </button>
                <button type='button' className={`${Styles.stageCheck} ${stage.done ? Styles.stageCheckOn : ''}`} disabled={!enabled} style={{color}}
                    aria-label={stage.done ? t('Undo {{name}}', {name: stage.name}) : t('Score {{name}}', {name: stage.name})} onClick={() => handleCheck(stage)}>{stage.done ? '✓' : ''}</button>
            </div>
            {expanded && rules ? <p className={Styles.stageRules}>{replaceAsterisks(rules)}</p> : null}
        </div>
    }

    return <div className={Styles.tacticCard}>
        <div className={Styles.tacticHeader}>
            <button type='button' className={Styles.tacticHead} onClick={openCard}>
                <h4 className={Styles.cardTitle}>{progress.card.name}</h4>
                <InfoIcon size={24} className={Styles.infoIcon} />
            </button>
            <span className={Styles.stageMark}>{progress.total} {t('/ 15 VP')}</span>
        </div>
        <div className={Styles.tacticBody}>
            {map(progress.stages, renderStage)}
            {active && isTacticsBlocked(game, index) ? <p className={Styles.cardSub}>{t('Seized the initiative: tactics cannot be scored on this turn.')}</p> : null}
            {scoredThisTurn ? <p className={Styles.cardSub}>{t('A stage of this card is already scored this turn.')}</p> : null}
        </div>
    </div>
}

export default GameTactic
