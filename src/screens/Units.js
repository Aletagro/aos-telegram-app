import React from 'react';
import {useLocation} from 'react-router-dom'
import Accordion from '@mui/joy/Accordion'
import AccordionDetails from '@mui/joy/AccordionDetails'
import AccordionSummary from '@mui/joy/AccordionSummary'
import {unitsSortesByType} from '../utilities/utils'
import Constants from '../Constants'
import Row from '../components/Row'
import HeaderImage from '../components/HeaderImage'

import Styles from './styles/Units.module.css'

const dataBase = require('../dataBase.json')

const Units = () => {
    const allegiance = useLocation().state.allegiance
    const warscrollIds = dataBase.data.warscroll_faction_keyword.filter((item) => item.factionKeywordId === allegiance.id).map(item => item.warscrollId)
    const units = unitsSortesByType(warscrollIds.map(warscrollId => dataBase.data.warscroll.find(scroll => scroll.id === warscrollId)).filter(unit => !unit.isSpearhead && !unit.isLegends))

    const renderRow = (unit) => <Row
        key={unit?.id}
        title={unit?.name}
        subtitle={unit?.points ? `${unit?.points} pts` : undefined}
        image={unit?.rowImage}
        navigateTo='warscroll'
        state={{unit}}
    />

    const renderUnitsType = (type) => <div id={Styles.typeContainer} key={type.title}>
        <Accordion defaultExpanded={true}>
            <AccordionSummary id={Styles.headerContainer} sx={(theme) => (Constants.accordionStyle)}>
                <h4 id={Styles.header}>{type.title}</h4>
            </AccordionSummary>
            <AccordionDetails>
                {type.units.map(renderRow)}
            </AccordionDetails>
        </Accordion>
    </div>

    return <>
        <HeaderImage src={allegiance.rosterHeaderImage} alt={allegiance.name} isWide />
        <div id='column' className='Chapter'>
            {units.map(renderUnitsType)}
        </div>
    </>
}

export default Units