import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/firestore'
require('firebase/database');

const firebaseConfig = {
  apiKey: "AIzaSyBSZDPFopZP_72U7aGNOjbxQQB4f618zbQ",
  authDomain: "products-app-5d772.firebaseapp.com",
  projectId: "products-app-5d772",
  storageBucket: "products-app-5d772.appspot.com",
  messagingSenderId: "635234318516",
  appId: "1:635234318516:web:0d9169d9726648894b7fe1"
};

firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
