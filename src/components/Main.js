import React from 'react';
import {Link} from 'react-router-dom'
import './styles/Main.css'

const grandAlliances = [
    {
        name: 'Chaos',
        id: '90175462-fae6-41e4-a0fe-19e41a833c9a'
    },
    {
        name: 'Death',
        id: '5c504c0c-cb25-4513-a137-7dd9efc172db'
    },
    {
        name: 'Destruction',
        id: '3abb8417-72f9-47ab-a372-4d3f84c03caa'
    },
    {
        name: 'Order',
        id: 'ecb12990-a5de-4f3e-bc53-39d73855cbea'
    }
]

const Main = () => {

    const renderButton = (grandAlliance) => <Link key={grandAlliance.id} to={'catalog'} state={{grandAlliance}}>{grandAlliance.name}</Link>

    return <>
        <p className='title'>Age of Sigmar</p>
        <div id='column' className='Chapter'>
        {grandAlliances.map(renderButton)}
        </div>
    </>
}

export default Main