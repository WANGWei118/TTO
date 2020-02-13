import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Spin } from 'antd';
import QuizCardCollaborative from './QuizCardCollaborative';
import images from '../images';

import './QuizSelectorCollab.css';
import { useHistory } from 'react-router-dom';
import HeaderComponent from '../HeaderComponent';
import QuizMusicCard from './QuizMusicCard';
const { TabPane } = Tabs;
const QuizSelectorCollab = props => {

    const TANGIBLE = 'tangible';
    const NORMAL = 'normal';
    const url = 'http://192.168.182.29:10000/'

    const history = useHistory();
    const socket = props.socket;

    const [loading, setLoading] = useState(true);
    const [collabQuizNormal, setCollabQuizNormal] = useState([]);
    const [collabQuizTangible, setCollabQuizTangible] = useState([]);
    const [collabQuizMusic, setCollabQuizMusic] = useState([]);




    useEffect(() => {
        socket.on('all types quiz', (result) => {
            console.log(result);
            setCollabQuizNormal(result.collaborative.handsMove)
            setCollabQuizTangible(result.collaborative.handsTouch)
            setCollabQuizMusic(result.collaborative.music);
            setLoading(false)
        });
        socket.emit('get all types quiz');

        return () => {
            socket.off('all types quiz');
        }
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

    const renderMusicList = (data, type) => {
        return (
            <>
                {data.map((item) => {
                    return (
                        <QuizMusicCard key={item._id} music={item} type={type} />
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
            <HeaderComponent title="Selectionner un Quiz collaboratif" />
            <Tabs defaultActiveKey="1" type="card">
                <TabPane tab="Quiz - Les mains bougent" key="1">
                    {loading ? <Spin tip="Chargement" ></Spin> : renderList(collabQuizNormal, NORMAL)}

                </TabPane>
                <TabPane tab="Quiz - les mains touchent" key="2">
                    {loading ? <Spin tip="Chargement" ></Spin> : renderList(collabQuizTangible, TANGIBLE)}
                </TabPane>
                <TabPane tab="Quiz - Jouer avec la musique" key="3">
                    {loading ? <Spin tip="Chargement" ></Spin> : renderMusicList(collabQuizMusic, NORMAL)}

                </TabPane>
            </Tabs>
        </div>
    )
};

QuizSelectorCollab.propTypes = {

};

export default QuizSelectorCollab;
