import React from 'react';
import './HeaderComponent.css';
import images from './images';
import { useHistory } from 'react-router-dom';

const HeaderComponent = props => {

    const history = useHistory();

    const goBack = () => {
        history.goBack();
    }

    return (
        <div className="quizSelectorHeader">
            <img src={images[7].title} className='backButton' onClick={() => goBack()} />
            <h1 className="pageTitle">{props.title}</h1>
        </div>

    );
};


export default HeaderComponent;