import React from 'react';
import logo from './logo.svg';
import './App.css';
import NewTheme from './component/listOfQuiz/newTheme'
import HomePage from './component/homepage/homepage'
import CreateQuiz from './component/listOfQuiz/createQuiz'
import DetailTheme from './component/listOfQuiz/detailTheme'
import DetailQuiz from './component/listOfQuiz/detailQuiz'
import Profile from './component/profile/profile'
import DetailProfile from './component/profile/detailProfile'

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
                  <Route path="/homepage">
                      <HomePage socket = {socket}/>
                  </Route>
                  <Route path="/newTheme">
                      <NewTheme socket = {socket}/>
                  </Route>
                  <Route path="/detailThemeIndividuel">
                      <DetailTheme type = 'individuel' socket = {socket}/>
                  </Route>
                  <Route path="/detailThemeCollaboratif">
                      <DetailTheme type = 'collaboratif' socket = {socket}/>
                  </Route>
                  <Route path="/detailThemeTangible">
                      <DetailTheme type = 'tangible' socket = {socket}/>
                  </Route>
                  <Route path="/detailThemeNonTangible">
                      <DetailTheme type = 'non-tangible' socket = {socket}/>
                  </Route>
                  <Route path="/allQuiz">
                      <DetailQuiz socket = {socket}/>
                  </Route>
                  <Route path="/createQuiz">
                      <CreateQuiz socket = {socket}/>
                  </Route>
                  <Route path={`/profile/:id`}>
                      <DetailProfile socket = {socket}/>
                  </Route>
                  <Route path="/profile">
                      <Profile socket = {socket}/>
                  </Route>

                  <Route path="/">
                      <HomePage />
                  </Route>
              </Switch>
          </div>
      </Router>
  );
}

export default App;
