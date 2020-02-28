import React from 'react';
import { useHistory } from 'react-router-dom';
import './QuizMusicCard.css';
import { SERVER_URL } from '../../constants.js';

const QuizMusicCard = props => {

    /**
    * Props or constants
    */
    const history = useHistory();
    const music = props.music;
    const musicName = music.description;
    /**
     * redux
     */

    /**
     * States
     */



    const handleClick = (item) => {
        console.log(item)
        history.push({
            pathname: '/quizCollabSupervisor',
            state: { quiz: { item } }
        })
    }

    return (
        <div className="quizCard" onClick={() => handleClick(music)}>
            <img className={"quizImage"} src={SERVER_URL + music.cover} /> :
            <h2 className="quizName">{musicName}</h2>
        </div>
    );
};

export default QuizMusicCard;
