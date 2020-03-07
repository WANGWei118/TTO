import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Homepage from './component/homepage/homepage.js'
import NewTheme from './component/listOfQuiz/newTheme'
import CreateQuiz from './component/listOfQuiz/createQuiz'
import Client from './socket/client'
import App from './App'

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
