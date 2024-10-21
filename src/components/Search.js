import React, {useState, useEffect} from 'react';
import Row from './Row'
import './styles/Catalog.css'

const dataBase = require('../dataBase.json')

const Search = () => {
    const [value, setValue] = useState('')
    const [warscrolls, setWarscrolls] = useState([])

    // TODO добавить дебаунс
    useEffect(() => {
        if (value) {
            const warscrolls = dataBase.data.warscroll.filter((warscroll) => !warscroll.isSpearhead && warscroll.name.toLowerCase().includes(value.toLowerCase()))
            setWarscrolls(warscrolls.splice(0, 20))
        } else {
            setWarscrolls([])
        }
      }, [value]);


    const handleChange = (e) => setValue(e.target.value)

    const renderWarscroll = (unit) => <Row
        key={unit.id}
        title={unit.name}
        navigateTo='warscroll'
        state={{unit}}
    />

    return <>
        <p className='title'>Поиск</p>
        <input onChange={handleChange} autoFocus placeholder='Start Typing' type='search' id='search' name='search' size={40} />
        <div id='column' className='Chapter'>
            {warscrolls && warscrolls.map(renderWarscroll)}
        </div>
    </>
}

export default Search