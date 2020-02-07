import React from 'react';
import logo from './logo.svg';
import './App.css';
import HomePage from './component/homepage'
import DetailTheme from './component/detailTheme'
import CreateQuiz from './component/createQuiz'

import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import openSocket from 'socket.io-client';
export const socket = openSocket('http://192.168.1.11:10000');

function App() {
  return (
      <Router>
          <div>
              {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
              <Switch>
                  <Route path="/homePage">
                      <HomePage />
                  </Route>
                  <Route
                      path="/detailTheme"
                      component={DetailTheme} />
                  <Route path="/">
                      <CreateQuiz socket = {socket}/>
                  </Route>
              </Switch>
          </div>
      </Router>
  );
}

export default App;
