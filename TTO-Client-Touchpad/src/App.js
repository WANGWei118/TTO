import React from 'react';
import './App.css';
import QuizSelector from './component/QuizSelector';
import QuizGame from './component/QuizGame';
import Menu from './component/Menu';
import openSocket from 'socket.io-client';
import QuizGameCollab from './component/QuizGameCollab';
import { Provider } from 'react-redux';
import store from './store/index';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import TableSupervisor from './component/collaborative/TableSupervisor';
import QuizSelectorCollab from './component/collaborative/QuizSelectorCollab';
import SelectAccueilli from './component/SelectAccueilli';
import ThemeSelector from './component/ThemeSelector';

export const socket = openSocket('http://10.189.147.120:10000');

const App = () => {
    return (
        <Provider store={store}>
            <Router>
                <div className="appDiv">
                    {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
                    <Switch>
                        <Route path="/selectAccueilli">
                            <SelectAccueilli socket={socket} />
                        </Route>
                        <Route path="/themes">
                            <ThemeSelector socket={socket} />
                        </Route>
                        <Route path="/quiz">
                            <QuizSelector socket={socket} />
                        </Route>
                        <Route path="/quizSelectorCollab">
                            <QuizSelectorCollab socket={socket} />
                        </Route>
                        <Route path="/quizCollabSupervisor" render={(props) => <TableSupervisor {...props} socket={socket} />}>
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
        </Provider>
    );
}

export default App;
