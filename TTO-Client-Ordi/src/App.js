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
import CreateProfile from './component/profile/createProfile'
import QuizByTopic from './component/listOfQuiz/quizByTopic'

import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import openSocket from 'socket.io-client';
export const socket = openSocket('http://localhost:10000');


let profileId = null;

function handleId(val) {
    profileId = val;
}
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
                  <Route path="/detailProfile">
                      <DetailProfile socket = {socket}/>
                  </Route>
                  <Route path="/profile">
                      <Profile socket = {socket} handleId ={handleId.bind(this)}/>
                  </Route>
                  <Route path="/createProfile">
                      <CreateProfile socket = {socket}/>
                  </Route>
                  <Route path="/quizByTopic">
                      <QuizByTopic socket = {socket}/>
                  </Route>

                  <Route path="/">
                      <HomePage socket = {socket}/>
                  </Route>
              </Switch>
          </div>
      </Router>
  );
}

export default App;
