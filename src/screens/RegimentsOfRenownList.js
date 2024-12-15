import React from 'react'
import Accordion from '@mui/joy/Accordion'
import AccordionDetails from '@mui/joy/AccordionDetails'
import AccordionSummary from '@mui/joy/AccordionSummary'
import Constants from '../Constants'
import {sortByName, regimentSortesByGrandAlliances} from '../utilities/utils'
import Row from '../components/Row'
import HeaderImage from '../components/HeaderImage'

import Styles from './styles/RegimentsOfRenownList.module.css'

const dataBase = require('../dataBase.json')

const RegimentsOfRenownList = () => {
    const regimentsOfRenown = sortByName(dataBase.data.ability_group.filter((group) => group.abilityGroupType === 'regimentOfRenown'))

    const sortedRegimentsOfRenown = regimentSortesByGrandAlliances(regimentsOfRenown.map(regiment => {
        const keywords = dataBase.data.warscroll.find(warscroll => warscroll.id === regiment.regimentOfRenownRowImageWarscrollId).referenceKeywords
        return {...regiment, keywords}
    }))

    const renderRow = (regiment) => <Row
        key={regiment.id}
        title={regiment.name}
        subtitle={regiment?.regimentOfRenownPointsCost ? `${regiment?.regimentOfRenownPointsCost} pts` : undefined}
        navigateTo='regimentOfRenown'
        state={{regiment}}
    />

    const renderRegimentAlliance = (alliance) => <div id={Styles.typeContainer} key={alliance.title}>
        <Accordion defaultExpanded={true}>
            <AccordionSummary id={Styles.headerContainer} sx={(theme) => (Constants.accordionStyle)}>
                <h4 id={Styles.header}>{alliance.title}</h4>
            </AccordionSummary>
            <AccordionDetails>
                {alliance.regiments.map(renderRow)}
            </AccordionDetails>
        </Accordion>
    </div>

    return <>
        <HeaderImage src={Constants.regimentsOfRenownImage} alt='Regiment Of Renown' />
        <div id='column' className='Chapter'>
            {sortedRegimentsOfRenown && sortedRegimentsOfRenown.map(renderRegimentAlliance)}
        </div>
    </>
}

export default RegimentsOfRenownList