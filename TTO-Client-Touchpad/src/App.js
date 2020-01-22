import React from 'react';
import './App.css';
import QuizSelector from './component/QuizSelector';
import QuizGame from './component/QuizGame';
import Menu from './component/Menu';
import openSocket from 'socket.io-client';

import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

export const socket = openSocket('http://localhost:10000');

const App = () => {
    return (
        <Router>
            <div>
                {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
                <Switch>
                    <Route path="/quiz">
                        <QuizSelector socket={socket} />
                    </Route>
                    <Route
                        path="/quizGame"
                        render={(props) => <QuizGame {...props} isAuted={true} />} />
                    <Route path="/">
                        <Menu />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;