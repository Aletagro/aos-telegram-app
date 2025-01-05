import React from 'react';
import {useLocation} from 'react-router-dom'
import Rule from '../components/Rule'

import Styles from './styles/Rules.module.css'

const dataBase = require('../dataBase.json')

const Rules = ({info}) => {
    const {paragraph, rules} = useLocation().state
    const _paragraph = info || paragraph
    const _rules = rules || dataBase.data.rule_container.filter((group) => group.ruleSectionId === _paragraph.id)
    _rules.sort((a, b) => a.displayOrder - b.displayOrder)

    const renderRuleComponent = (rule) => <Rule key={rule.id} rule={rule} />

    const renderRule = (rule) => {
        const components = dataBase.data.rule_container_component.filter((component) => component.ruleContainerId === rule.id)
        components.sort((a, b) => a.displayOrder - b.displayOrder)
        return <>
            <h4 id={Styles.title} key={rule.id}>{rule.title}</h4>
            {rule.subtitle ? <h5>{rule.subtitle}</h5> : null}
            {components.map(renderRuleComponent)}
        </>
    }

    return <div id={Styles.container}>
        {_rules && _rules.map(renderRule)}
    </div>
}

export default Rules