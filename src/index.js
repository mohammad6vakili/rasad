import React from 'react';
import ReactDOM from 'react-dom';
// import "./Helper/NotifStyle.css";
import App from './App';
import 'antd/dist/antd.css';
import {Provider} from "react-redux";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import thunk from "redux-thunk";
import {createStore, combineReducers, applyMiddleware} from "redux";
import {BrowserRouter} from "react-router-dom";
import Reducer from "./Store/Reducer";
import * as serviceWorker from "./serviceWorker";


const rootReducer=combineReducers({
  Reducer:Reducer
});

const store = createStore(rootReducer , applyMiddleware(thunk));

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <ToastContainer rtl autoClose={6000} pauseOnFocusLoss={false}/>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);
serviceWorker.register();
