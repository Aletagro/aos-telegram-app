import React from 'react';
import {Link} from 'react-router-dom'
import './styles/Main.css'

const grandAlliances = [
    {
        name: 'Chaos',
        id: '90175462-fae6-41e4-a0fe-19e41a833c9a',
        image: 'https://dhss9aar8ocw.cloudfront.net/2a08adc1-4b87-43de-9c1a-7f8c9ca6699a'
    },
    {
        name: 'Death',
        id: '5c504c0c-cb25-4513-a137-7dd9efc172db',
        image: 'https://dhss9aar8ocw.cloudfront.net/ed6e96e2-c8db-4bd1-bdc6-25e3ce953305'
    },
    {
        name: 'Destruction',
        id: '3abb8417-72f9-47ab-a372-4d3f84c03caa',
        image: 'https://dhss9aar8ocw.cloudfront.net/bffedbb2-a415-484a-abac-97aa5e92b3b6'
    },
    {
        name: 'Order',
        id: 'ecb12990-a5de-4f3e-bc53-39d73855cbea',
        image: 'https://dhss9aar8ocw.cloudfront.net/ae7d81ea-0642-4eae-9742-b0a061ff6feb'
    }
]

const Main = () => {

    const renderButton = (grandAlliance) => <Link key={grandAlliance.id} to={'catalog'} state={{grandAlliance}}>{grandAlliance.name}</Link>

    return <>
        <p className='title'>Age of Sigmar</p>
        <img src='https://kartinki.pics/uploads/posts/2022-08/thumbs/1660848806_7-kartinkin-net-p-varkhammer-fentezi-malekit-oboi-krasivo-8.jpg' alt='main' width='100%' />
        <div id='column' className='Chapter'>
        {grandAlliances.map(renderButton)}
        <Link to={'regimentOfRenownList'}>Regiment Of Renown</Link>
        </div>
    </>
}

export default Main