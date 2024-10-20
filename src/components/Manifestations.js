import React from 'react';
import Row from './Row'
import './styles/Catalog.css'

const dataBase = require('../dataBase.json')

const manifestationsPublicationId = '318c212e-cbcd-4b44-a44d-318f3ae180a0'

const Manifestations = () => {
    let lores = dataBase.data.lore.filter((lore) => lore.publicationId === manifestationsPublicationId)
    lores.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))

    const renderUnit = (unit) => <Row
        key={unit.id}
        title={unit.name}
        navigateTo='warscroll'
        state={{unit}}
    />

    const renderLore = (lore) => {
        const spells = dataBase.data.lore_ability.filter(ability => ability.loreId === lore.id)
        const units = spells.map(spell => dataBase.data.warscroll.find(warscroll => warscroll.id === spell.linkedWarscrollId))
        return <>
            <h4>{lore.name}</h4>
            {units.map(renderUnit)}
        </>
    }

    return <>
        <p className='title'>Manifestations</p>
        <div id='column' className='Chapter'>
            {lores && lores.map(renderLore)}
        </div>
    </>
}

export default Manifestations