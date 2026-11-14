import React from 'react'

import Styles from './styles/Splash.module.css'

// Экран загрузки базы данных: индикатор по доле скачанного, при ошибке - кнопка повтора
const Splash = ({progress, hasError, onRetry}) => <div className={Styles.splash}>
    <p className={Styles.title}>Age of Sigmar</p>
    {hasError
        ? <>
            <p className={Styles.text}>Could not load the game data. Check your connection and try again.</p>
            <button type='button' className={Styles.button} onClick={onRetry}>Try again</button>
        </>
        : <>
            <p className={Styles.text}>Loading game data… {Math.round(progress * 100)}%</p>
            <div className={Styles.bar}><div className={Styles.fill} style={{width: `${Math.round(progress * 100)}%`}} /></div>
        </>
    }
</div>

export default Splash
