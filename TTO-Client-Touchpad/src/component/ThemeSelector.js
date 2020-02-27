import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import QuizCard from './QuizCard';
import HeaderComponent from './HeaderComponent';
import { Spin } from 'antd';
import ThemeCard from './ThemeCard';

const ThemeSelector = props => {

    /**
     * Props
    */
    const socket = props.socket;

    /**
     * redux
     */

    const selectedAccueilli = useSelector((state) => state.accueilli.accueilliSelected)

    /**
     * States
     */

    const [themeList, setThemeList] = useState([]);
    const [loadingTheme, setLoadingTheme] = useState(true);



    console.log(themeList);

    const accueilliCanPlay = (item) => {
        if (item.quiz) {
            if (item.quiz.personalQuiz.length > 0 || item.quiz.tableQuiz.length > 0) {
                for (let id of item.quiz.personalQuiz) {
                    if (selectedAccueilli.tempSelectedAccueilli.quizAccessible.quizIndividuel.includes(id)) {
                        return true
                    }
                }
            }
        }

        return false;
    }
    const renderList = (data, type) => {
        if ((selectedAccueilli !== null) && (selectedAccueilli !== undefined)) {
            return (
                <>
                    {data.map((item) => {
                        if (accueilliCanPlay(item)) {
                            return <ThemeCard key={item._id} theme={item} />
                        }
                        else {
                            return <></>
                        }
                    })
                    }
                </>
            )
        }
        else
            return (
                <>
                    {data.map((item) => {
                        if (item.quiz) {
                            if (item.quiz.personalQuiz.length > 0 || item.quiz.tableQuiz.length > 0) {
                                return (
                                    <ThemeCard key={item._id} theme={item} />
                                )
                            }
                        }
                    })}
                </>
            )
    }

    useEffect(() => {
        socket.emit('get topics');
        socket.on('all topics', result => {
            setThemeList(result);
            setLoadingTheme(false);
        })

        return () => {
            socket.off('all topics');
        }
    }, []);

    return (
        < div >
            <HeaderComponent title="Selectionner un théme" />
            {/* <h1 className="pageTitle">Selectionner un Quiz</h1> */}
            <div className="randomQuiz"></div>
            {loadingTheme ? <Spin tip="Chargement" ></Spin> : renderList(themeList)}
        </div >
    );
};



export default ThemeSelector;