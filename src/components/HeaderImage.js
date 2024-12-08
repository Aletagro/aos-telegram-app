import React, {useState} from 'react';
import placeholder from '../images/placeholder.png'

const Styles = {
    big: {
        width: '100%',
        aspectRatio: 1.85
    },
    wide: {
        width: '100%',
        aspectRatio: 3.75
    }
}

const HeaderImage = ({src, alt, isWide}) => {
    const [loaded, setLoaded] = useState(false)

    const handleImageLoaded = (e) => {
        setLoaded(true)
    }

    return <img src={loaded ? src : placeholder} alt={alt} style={isWide ? Styles.wide : Styles.big} onLoad={handleImageLoaded}/>
}

export default HeaderImage