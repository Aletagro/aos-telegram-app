import React from 'react';
import Constants from '../Constants'
import {sortByName} from '../utilities/utils'
import Row from '../components/Row'

const dataBase = require('../dataBase.json')

const Manifestations = () => {
    window.scrollTo(0, 0)
    let lores = dataBase.data.lore.filter((lore) => lore.publicationId === Constants.manifestationsPublicationId)
    sortByName(lores)

    const renderUnit = (unit) => <Row
        key={unit.id}
        title={unit.name}
        image={unit?.rowImage}
        navigateTo='warscroll'
        state={{unit}}
    />

    const renderLore = (lore) => {
        const spells = dataBase.data.lore_ability.filter(ability => ability.loreId === lore.id)
        const units = spells.map(spell => dataBase.data.warscroll.find(warscroll => warscroll.id === spell.linkedWarscrollId))

        return <div key={lore.id}>
            <h4>{lore.name}</h4>
            {units.map(renderUnit)}
        </div>
    }

    return <>
        <div id='column' className='Chapter'>
            {lores && lores.map(renderLore)}
        </div>
    </>
}

export default Manifestations