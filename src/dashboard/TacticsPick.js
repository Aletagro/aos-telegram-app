import {t} from '../utilities/i18n'
import React from 'react'
import {useNavigate} from 'react-router-dom'
import Modal from '../components/Modal'
import Button from '../components/Button'
import InfoIcon from '../icons/InfoIcon'
import {getStringAfterDash} from '../utilities/utils'
import {TACTIC_CARDS} from './missionData'

import map from 'lodash/map'
import find from 'lodash/find'
import includes from 'lodash/includes'

import Styles from './styles/Dashboard.module.css'

const dataBase = require('../utilities/db')

// Выбор двух карточек тактик. selected - id выбранных карточек, onChange получает новый список, onDone - когда выбрано две
const TacticsPick = ({visible, selected, onChange, onDone, onClose}) => {
    const navigate = useNavigate()
    const toggle = (id) => () => {
        if (includes(selected, id)) onChange(selected.filter(item => item !== id))
        else if (selected.length < 2) onChange([...selected, id])
    }

    const openInfo = (card) => () => {
        const tactic = find(dataBase.data.rule_container, container => getStringAfterDash(container.title) === card.name)
        if (tactic) navigate('/tactic', {state: {title: card.name, tactic}})
    }

    return <Modal visible={visible} title={t('Battle tactic cards')} onClose={onClose} Content={() => <div className={Styles.gap}>
        <p className={Styles.muted}>{t('Choose 2 cards. Each card is played through three stages: Affray, Strike, Domination.')}</p>
        <div className={Styles.pickBox}>
            {map(TACTIC_CARDS, card => <div key={card.id} className={`${Styles.mission} ${includes(selected, card.id) ? Styles.missionActive : ''}`}>
                <button type='button' className={Styles.missionBody} onClick={toggle(card.id)}>
                    <span className={Styles.missionName}>{card.name}</span>
                    <span className={Styles.missionTable}>{map(card.stages, 'name').join(' → ')}</span>
                </button>
                <button type='button' className={Styles.missionInfo} aria-label={t('Tactic card rules')} onClick={openInfo(card)}><InfoIcon size={22} /></button>
            </div>)}
        </div>
        <Button disabled={selected.length !== 2} onClick={onDone}>{t('Done')}</Button>
    </div>} />
}

export default TacticsPick
