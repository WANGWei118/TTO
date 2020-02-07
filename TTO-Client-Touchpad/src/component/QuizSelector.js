import React, { useState, useEffect } from 'react';
import QuizCard from './QuizCard';
import './QuizSelector.css';
import { useSelector } from 'react-redux';
import { Tabs, Spin } from 'antd';
import HeaderComponent from './HeaderComponent';

const { TabPane } = Tabs;
const INDIVIDUAL_TYPE = 'quizIndividuel';
const COLLAB_TYPE = 'quizNonTangible';

const QuizSelector = (props) => {

    const socket = props.socket

    const [loadingIndividual, setLoadingIndividual] = useState(true);
    const [loadingCollab, setLoadingCollab] = useState(true);
    const [individualQuiz, setIndividualQuiz] = useState(null);
    const [collabQuiz, setCollabQuiz] = useState(null);
    const selectedAccueilli = useSelector((state) => state.selected)



    useEffect(() => {
        socket.on('all types quiz', (result) => {
            setCollabQuiz(result.nonTangible);
            setIndividualQuiz(result.individuel)

            setLoadingCollab(false);
            setLoadingIndividual(false);

        });
        socket.emit('get all types quiz');

        return () => {
            socket.off('all types quiz');
        }
    }, [])

    const renderList = (data, type) => {

        if (selectedAccueilli !== null && selectedAccueilli !== undefined) {
            return (
                <>
                    {data.map((item) => {
                        if (selectedAccueilli.tempSelectedAccueilli.quizAccessible[type].includes(item.id)) {
                            return (
                                <QuizCard key={item._id} quiz={item} type={type} />
                            )
                        } else {
                            return (null);
                        }
                    })}
                </>
            )
        }
        else
            return (
                <>
                    {data.map((item) => {
                        return (
                            <QuizCard key={item._id} quiz={item} type={type} />
                        )
                    })}
                </>
            )
    }


    return (
        <div>
            <HeaderComponent title="Selectionner un Quiz" />
            {/* <h1 className="pageTitle">Selectionner un Quiz</h1> */}
            <div className="randomQuiz"></div>
            <Tabs defaultActiveKey="1" type="card">
                <TabPane tab="Selectionner une réponse" key="1">
                    {loadingIndividual ? <Spin tip="Chargement" ></Spin> : renderList(individualQuiz, INDIVIDUAL_TYPE)}
                </TabPane>
                <TabPane tab="Mettre les réponses au centre" key="2">
                    {loadingCollab ? <Spin tip="Chargement" ></Spin> : renderList(collabQuiz, COLLAB_TYPE)}
                </TabPane>
            </Tabs>
        </div>
    )

}

export default QuizSelector;
