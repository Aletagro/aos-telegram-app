import React, {useState, useReducer} from 'react';
import useDebounce from '../utilities/useDebounce'
import {sortByName} from '../utilities/utils'
import {search} from '../utilities/appState'
import Row from '../components/Row'

import Styles from './styles/Search.module.css'

const dataBase = require('../dataBase.json')

const Search = () => {
    const [value, setValue] = useState(search.value)
    // eslint-disable-next-line
    const [_, forceUpdate] = useReducer((x) => x + 1, 0)

    useDebounce(() => {
        if (value) {
            const warscrolls = dataBase.data.warscroll.filter((warscroll) => !warscroll.isSpearhead && warscroll.name.toLowerCase().includes(value.toLowerCase()))
            search.warscrolls = sortByName(warscrolls.splice(0, 20))
        } else {
            search.warscrolls = []
        }
        forceUpdate()
      }, [value], 300
    );

    const handleChange = (e) => {
        search.value = e.target.value
        setValue(e.target.value)
    }

    const renderWarscroll = (unit) => <Row
        key={unit.id}
        title={unit.name}
        subtitle={unit?.points ? `${unit?.points} pts` : undefined}
        image={unit?.rowImage}
        navigateTo='warscroll'
        state={{unit}}
    />

    return <>
        <div id={Styles.container}>
            <input id={Styles.input} onChange={handleChange} autoFocus placeholder='Start Typing' type='search' name='search' size={40} />
        </div>
        <div id='column' className='Chapter'>
            {search.warscrolls.map(renderWarscroll)}
        </div>
    </>
}

export default Search