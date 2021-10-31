import React, { useEffect } from 'react';
import "./App.css";
import Header from './Components/Header/Header';
import Login from './Components/Auth/Login';
import Home from './Components/Home/Home';
import DesktopView from "./Components/DesktopView/DesktopView";
import PrivateRoute from "./Helper/PrivateRoute";
import { Switch , Route } from 'react-router';

const App=()=>{

    return(
        <>
            <div className="app">
                <DesktopView/>
            </div>
            <div className="pwa">
                <Header/>
                <Switch>
                    <Route path="/" exact component={Login}/>
                    <PrivateRoute path="/home" component={Home}/>
                </Switch>
            </div>
        </>
    )
}
export default App;