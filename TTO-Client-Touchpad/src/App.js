import React from 'react';
import './App.css';
import QuizSelector from './component/QuizSelector';
import QuizGame from './component/QuizGame';
import Menu from './component/Menu';
import openSocket from 'socket.io-client';
import QuizGameCollab from './component/QuizGameCollab';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import TableSupervisor from './component/collaborative/TableSupervisor';
import QuizSelectorCollab from './component/collaborative/QuizSelectorCollab';

export const socket = openSocket('http://localhost:10000');

const App = () => {
    return (
        <Router>
            <div className="appDiv">
                {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
                <Switch>
                    <Route path="/quiz">
                        <QuizSelector socket={socket} />
                    </Route>
                    <Route path="/quizSelectorCollab">
                        <QuizSelectorCollab socket={socket} />
                    </Route>
                    <Route path="/quizCollabSupervisor" render={(props) => <TableSupervisor {...props} socket={socket} />}>
                        {/* <TableSupervisor socket={socket} /> */}
                    </Route>
                    <Route
                        path="/quizGame"
                        render={(props) => <QuizGame {...props} isAuted={true} />} />
                    <Route
                        path="/quizGameCollab"
                        render={(props) => <QuizGameCollab {...props} isAuted={true} />} />
                    <Route path="/">
                        <Menu socket={socket} />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
