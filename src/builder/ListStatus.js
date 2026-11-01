import React from 'react'

import {roster} from '../utilities/appState'

import map from 'lodash/map'
import startsWith from 'lodash/startsWith'
import size from 'lodash/size'

import Styles from './styles/ListStatus.module.css'

const Svg = ({children}) => <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.6' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>{children}</svg>

export const getRegimentIndexFromIssue = (text, generalRegimentIndex = roster.generalRegimentIndex) => {
    if (startsWith(text, "In General's Regiment")) {
        return generalRegimentIndex
    }
    const match = /^In Regiment (\d+) /.exec(text)
    return match ? Number(match[1]) - 1 : null
}

export const getStatusText = (errors, warnings) => {
    const parts = []
    if (size(errors)) {
        parts.push(`${size(errors)} ${size(errors) === 1 ? 'error' : 'errors'}`)
    }
    if (size(warnings)) {
        parts.push(`${size(warnings)} ${size(warnings) === 1 ? 'warning' : 'warnings'}`)
    }
    return parts.join(' · ')
}

// Состояние списка прямо в билдере: готов к сохранению или есть ошибки и предупреждения. Раскрывается в перечень
// getAction(text) возвращает функцию, которая ведёт к месту исправления, или null, если у проблемы нет понятного места
const ListStatus = ({errors, warnings, expanded, onToggle, statusRef, getAction}) => {
    const hasErrors = size(errors) > 0
    const hasWarnings = size(warnings) > 0
    const state = hasErrors ? Styles.error : hasWarnings ? Styles.warning : Styles.ok

    const renderIssue = (type) => (text, index) => {
        const action = getAction ? getAction(text) : null
        return <li key={`${type}-${index}`} className={`${Styles.issue} ${type === 'error' ? Styles.issueError : Styles.issueWarning}`}>
            {action
                ? <button type='button' className={Styles.issueButton} onClick={action}>
                    <span className={Styles.issueText}>{text}</span>
                    <span className={Styles.issueFix}>Fix<Svg><path d='M9 5l7 7-7 7' /></Svg></span>
                </button>
                : text
            }
        </li>
    }

    return <div ref={statusRef} className={`${Styles.card} ${state}`}>
        <button
            type='button'
            className={Styles.head}
            onClick={hasErrors || hasWarnings ? onToggle : undefined}
            aria-expanded={expanded}
            disabled={!hasErrors && !hasWarnings}
        >
            <span className={Styles.mark}>
                <Svg>{hasErrors || hasWarnings ? <path d='M12 7v6M12 17h.01' /> : <path d='M5 12.5l4.5 4.5L19 7.5' />}</Svg>
            </span>
            <span className={Styles.text}>
                <span className={Styles.title}>{hasErrors ? 'List needs fixes' : hasWarnings ? 'List is valid, check hints' : 'List is ready'}</span>
                <span className={Styles.subtitle}>{hasErrors || hasWarnings ? getStatusText(errors, warnings) : 'No errors found'}</span>
            </span>
            {hasErrors || hasWarnings ? <span className={`${Styles.chevron} ${expanded ? Styles.chevronOpen : ''}`}><Svg><path d='M6 9l6 6 6-6' /></Svg></span> : null}
        </button>
        {expanded && (hasErrors || hasWarnings)
            ? <ul className={Styles.list}>
                {map(errors, renderIssue('error'))}
                {map(warnings, renderIssue('warning'))}
            </ul>
            : null
        }
    </div>
}

export default ListStatus
