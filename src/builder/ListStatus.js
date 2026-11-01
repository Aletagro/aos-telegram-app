import React from 'react'

import map from 'lodash/map'
import size from 'lodash/size'

import Styles from './styles/ListStatus.module.css'

const Svg = ({children}) => <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.6' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>{children}</svg>

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
const ListStatus = ({errors, warnings, expanded, onToggle, statusRef}) => {
    const hasErrors = size(errors) > 0
    const hasWarnings = size(warnings) > 0
    const state = hasErrors ? Styles.error : hasWarnings ? Styles.warning : Styles.ok

    const renderIssue = (type) => (text, index) => <li key={`${type}-${index}`} className={`${Styles.issue} ${type === 'error' ? Styles.issueError : Styles.issueWarning}`}>
        {text}
    </li>

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
