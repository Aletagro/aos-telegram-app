import React from 'react'
import {useLocation} from 'react-router-dom'
import Accordion from '@mui/joy/Accordion'
import AccordionDetails from '@mui/joy/AccordionDetails'
import AccordionSummary from '@mui/joy/AccordionSummary'
import {unitsSortesByType} from '../utilities/utils'
import Constants from '../Constants'
import Row from '../components/Row'
import HeaderImage from '../components/HeaderImage'

import Styles from './styles/Units.module.css'


const LegendUnits = () => {
    const {units, image, title} = useLocation().state
    const _units = unitsSortesByType(units)

    const renderRow = (unit) => <Row
        key={unit?.id}
        title={unit?.name}
        rightText={unit?.points ? `${unit?.points} pts` : undefined}
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
        <HeaderImage src={image} alt={title} isWide />
        <div id='column' className='Chapter'>
            {_units.map(renderUnitsType)}
        </div>
    </>
}

export default LegendUnits