import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {SERVER_URL} from '../constants.js'

const ThemeCard = props => {
    const history = useHistory();
    const theme = props.theme
    const image = theme.icon
    const topic = theme.topic;
    const dispatcher = useDispatch()

    const handleClick = (item) => {
        dispatcher({ type: 'select_topic', topicSelected: item })
        history.push({
            pathname: '/quiz',
        });

    }

    return (
        // <div className="quizCard" onClick={() => props.onClick()}>
        <div className="quizCard" onClick={() => handleClick(theme)}>
            {theme.icon ? <img className="quizImage" src={SERVER_URL + theme.icon} /> :
                <></>
            }
            <h2 className="quizName">{theme.topic}</h2>
        </div>
    )
};


export default ThemeCard;
