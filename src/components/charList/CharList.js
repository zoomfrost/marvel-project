import { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';

import { CSSTransition, TransitionGroup } from 'react-transition-group';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';





const setContent = (process, Component, newItemLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner/>;
        case 'loading':
            return newItemLoading ? <Component/> : <Spinner/>;
        case 'confirmed':
            return <Component/>;
        case 'error':
            return <ErrorMessage/>;
        default:
            throw new Error('Unexpected process');
    }
}

const CharList = (props) => {
    

    const [char, setChar] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(570);
    const [charEnded, setCharEnded] = useState(false)


    const { getAllCharacters, process, setProcess} =  useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
        // eslint-disable-next-line
        window.addEventListener('resize', () => {
            screenWidthRef.current = document.documentElement.clientWidth;
        })
        return () => {
            window.removeEventListener('resize', (e) => {
                screenWidthRef.current = document.documentElement.clientWidth;
            });
        }
        // eslint-disable-next-line
    },[]);


    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true)
        getAllCharacters(offset)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onCharLoaded = async (newChar) => {

        let ended = false;
        if(newChar.length < 9) {
            ended = true;
        }

        setChar(char => [...char, ...newChar]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }

    const itemsRef = useRef([]);
    let screenWidthRef = useRef(window.screen.width);

    const setRef = (i) => {
        itemsRef.current.forEach(item => item.classList.remove('char__item_selected'));
        itemsRef.current[i].classList.add('char__item_selected');
        itemsRef.current[i].focus();
    }

    


    function renderItems(arr) {
        const elements = arr.map((item, i) => {
            const {thumbnail, name, id} = item;
            const img = thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' ? true : false;
            if (screenWidthRef.current < 768) {
                return (
                    <CSSTransition key={id} timeout={500} classNames="char__item">
                        <a href="#charInfo">
                            <li onClick={() => {
                                props.onCharSelected(item.id);
                                setRef(i);
                                }}
                                ref={el => itemsRef.current[i] = el} 
                                key={id}
                                tabIndex={0}
                                className="char__item"
                                onKeyPress={(e) => {
                                    if (e.key === ' ' || e.key === "Enter") {
                                        props.onCharSelected(item.id);
                                        setRef(i);
                                    }
                                }}>
                                <img style={img ? {objectFit: 'contain'} : {}} src={thumbnail} alt="marvelhero"/>
                                <div className="char__name">{name}</div>
                            </li>
                        </a>
                    </CSSTransition>
                )
            } else {
                return (
                    <CSSTransition key={id} timeout={500} classNames="char__item">
                        <li onClick={() => {
                            props.onCharSelected(item.id);
                            setRef(i)
                            }}
                            ref={el => itemsRef.current[i] = el} 
                            key={id}
                            tabIndex={0}
                            className="char__item"
                            onKeyPress={(e) => {
                                if (e.key === ' ' || e.key === "Enter") {
                                    props.onCharSelected(item.id);
                                    setRef(i);
                                }
                            }}>
                            <img style={img ? {objectFit: 'contain'} : {}} src={thumbnail} alt="marvelhero"/>
                            <div className="char__name">{name}</div>
                        </li>
                    </CSSTransition>
                )
            }
            
        });

        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {elements}
                </TransitionGroup>
            </ul>
        )
        
    }
    const elements = useMemo(() => {
        return setContent(process, () => renderItems(char), newItemLoading)
        // eslint-disable-next-line
    }, [process])

    return (
        <div className="char__list">
            {elements}
            <button 
            className="button button__main button__long"
            disabled={newItemLoading}
            style={{'display': charEnded ? 'none' : 'block'}}
            onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;