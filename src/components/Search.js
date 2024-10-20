import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom'
import './styles/Catalog.css'

const dataBase = require('../dataBase.json')

const Search = () => {
    const [value, setValue] = useState('')
    const [warscrolls, setWarscrolls] = useState([])

    useEffect(() => {
        if (value) {
            const warscrolls = dataBase.data.warscroll.filter((warscroll) => !warscroll.isSpearhead && warscroll.name.toLowerCase().includes(value.toLowerCase()))
            setWarscrolls(warscrolls.splice(0, 20))
        } else {
            setWarscrolls([])
        }
      }, [value]);


    const handleChange = (e) => setValue(e.target.value)

    const renderWarscroll = (unit) => <Link key={unit?.id} to={'warscroll'} state={{unit}}>{unit?.name}</Link>

    return <>
        <p className='title'>Поиск</p>
        <input onChange={handleChange} autoFocus placeholder='Start Typing' type='search' id='search' name='search' size={40} />
        <div id='column' className='Chapter'>
            {warscrolls && warscrolls.map(renderWarscroll)}
        </div>
    </>
}

export default Search