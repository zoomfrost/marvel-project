import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';

import './charInfo.scss';

async function load() {
    if (!("scrollBehavior" in document.documentElement.style)) {
        await import("scroll-behavior-polyfill");
    }
}

load()

const CharInfo = (props) => {
    const [char, setChar] = useState(null);

    const {getCharacter, clearError, process, setProcess} =  useMarvelService();

    useEffect(() => {
        updateChar()
        // eslint-disable-next-line
    }, [props.charId])


    const updateChar = () => {
        const {charId} = props;
        if(!charId) {
            return;
        }
        clearError();
        getCharacter(charId)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'))

    }

    const onCharLoaded = (char) => {
        setChar(char);
    }


    return (
        <div className="char__info">
            {setContent(process, View, char)}
        </div>
    )
}

const View = ({data}) => {
    const {name, descrciption, thumbnail, homepage, wiki, comics} = data;
    const img = thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' ? true : false;
    const elements = comics.map((item, i) => {
        return (
            <li key={i} className="char__comics-item">
                {item.name}
            </li>
        )
    })

    
    return (
        <>
            <div scroll-behavior="smooth" id='charInfo' className="char__basics">
                <img style={img ? {objectFit: 'contain'} : {}} src={thumbnail} alt={name}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {descrciption}
            </div>
            <div className="char__comics">{comics.length ? 'Comics:' : 'There is no comics with this character'}</div>
            <ul className="char__comics-list">
                {elements.slice(0, 10)}
            </ul>
    </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;