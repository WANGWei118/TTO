import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Spin } from 'antd';
import QuizCardCollaborative from './QuizCardCollaborative';
import images from '../images';

import './QuizSelectorCollab.css';
import { useHistory } from 'react-router-dom';
const { TabPane } = Tabs;
const QuizSelectorCollab = props => {

    const TANGIBLE = 'tangible';
    const NORMAL = 'normal';

    const history = useHistory();
    const socket = props.socket;

    const [loading, setLoading] = useState(true);
    const [collabQuizNormal, setCollabQuizNormal] = useState([]);
    const [collabQuizTangible, setCollabQuizTangible] = useState([]);

    socket.on('all types quiz', (result) => {
        console.log(result)
        setCollabQuizNormal(result.nonTangible)
        setCollabQuizTangible(result.tangible)
        setLoading(false)
    });

    useEffect(() => {
        socket.emit('get all types quiz');
    }, [])

    const renderList = (data, type) => {
        return (
            <>
                {data.map((item) => {
                    return (
                        <QuizCardCollaborative key={item._id} quiz={item} type={type} />
                    )
                })}
            </>
        )
    }
    const goBack = () => {
        history.push('/');
    }


    return (
        <div>
            <div className="quizSelectorHeader">
                <img src={images[7].title} className='backButton' onClick={() => goBack()} />
                <h1 className="pageTitle">Selectionner un Quiz collaboratif</h1>
            </div>
            <Tabs defaultActiveKey="1" type="card">
                <TabPane tab="Quiz non tangible" key="1">
                    {loading ? <Spin tip="Chargement" ></Spin> : renderList(collabQuizNormal, NORMAL)}

                </TabPane>
                <TabPane tab="Quiz tangible" key="2">
                    {loading ? <Spin tip="Chargement" ></Spin> : renderList(collabQuizTangible, TANGIBLE)}
                </TabPane>
            </Tabs>
        </div>
    )
};

QuizSelectorCollab.propTypes = {

};

export default QuizSelectorCollab;