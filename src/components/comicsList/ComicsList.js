import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

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

const ComicsList = () => {

    const [comics, setComics] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(7847);
    const [comicsEnded, setComicsEnded] = useState(false)


    const {getAllComics, process, setProcess} =  useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
        // eslint-disable-next-line
    },[]);

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true)
        getAllComics(offset)
            .then(onComicsLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onComicsLoaded = (newComics) => {
        let ended = false;
        if(newComics.length < 8) {
            ended = true;
        }

        setComics(comics => [...comics, ...newComics]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 8);
        setComicsEnded(comicsEnded => ended);
    }

    function renderItems(arr) {
        const elements = arr.map((item, i) => {
            const {thumbnail, title, price, id} = item;
            return (
                <li key={i} className="comics__item">
                    <Link to={`/comics/${id}`}>
                        <img src={thumbnail} alt="ultimate war" className="comics__item-img"/>
                        <div className="comics__item-name">{title}</div>
                        <div className="comics__item-price">{price ? price + '$' : 'NOT AVAILABLE'}</div>
                    </Link>
                </li>
            )
        });

        return (
            <ul className="comics__grid">
                {elements}
            </ul>
        )
        
    }

    return (
        <div className="comics__list">
            {setContent(process, () => renderItems(comics), newItemLoading)}
            <button
            disabled={newItemLoading}
            style={{'display': comicsEnded ? 'none' : 'block'}}
            onClick={() => onRequest(offset)} 
            className="button button__main button__long">
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;