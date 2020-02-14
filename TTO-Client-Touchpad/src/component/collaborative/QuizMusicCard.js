import React from 'react';
import { useHistory } from 'react-router-dom';
import './QuizMusicCard.css';
const QuizMusicCard = props => {

    const history = useHistory();
    const music = props.music;
    const musicName = music.description;

    const url = 'http://192.168.43.223:10000/';

    const handleClick = (item) => {
        console.log(item)
        history.push({
            pathname: '/quizCollabSupervisor',
            state: { quiz: { item } }
        })
    }

    return (
        <div className="quizCard" onClick={() => handleClick(music)}>
            <img className={"quizImage"} src={url + music.cover} /> :
            <h2 className="quizName">{musicName}</h2>
        </div>
    );
};

export default QuizMusicCard;
