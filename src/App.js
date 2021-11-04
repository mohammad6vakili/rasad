import React, { useEffect, useState } from 'react';
import "./App.css";
import Header from './Components/Header/Header';
import Login from './Components/Auth/Login';
import Home from './Components/Home/Home';
import { useHistory , useLocation } from 'react-router';
import DesktopView from "./Components/DesktopView/DesktopView";
import PrivateRoute from "./Helper/PrivateRoute";
import { Switch , Route } from 'react-router';
import { Modal , Button} from 'antd';
import Colors from './Helper/Colors';
import logoLoading from "./Assets/animations/ngragif.gif";
import { toast } from 'react-toastify';
import PWAPrompt from 'react-ios-pwa-prompt';
import Menu from "./Components/Menu/Menu";

const App=()=>{
    const history=useHistory();
    const location=useLocation();
    const lat = localStorage.getItem("lat");
    const long = localStorage.getItem("long");
    const [loading , setLoading]=useState(lat ? false : true);
    const [textErr , setTextErr]=useState(false);

    useEffect(()=>{
        if(localStorage.getItem("token")){
            history.push("/home");
        }
        if (navigator.geolocation && window.outerWidth<=800) {
            navigator.geolocation.getCurrentPosition(setCoord,handler);
            function setCoord(position){
                localStorage.setItem("lat",position.coords.latitude.toFixed(6));
                localStorage.setItem("long",position.coords.longitude.toFixed(6));
                setLoading(false);
                setTextErr(false);
            }
            function handler(error){
                setTextErr(true);
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        toast.error("برای استفاده از نرم افزار نیاز به دسترسی موقعیت مکانی میباشد.لطفا خارج شوید و دوباره وارد شوید یا صفحه را رفرش کنید",{
                            position: toast.POSITION.TOP_RIGHT
                        });
                      break;
                    case error.POSITION_UNAVAILABLE:
                        toast.error("موقعیت جغرافیایی ناشناس میباشد.",{
                            position: toast.POSITION.TOP_RIGHT
                        });
                      break;
                    case error.TIMEOUT:
                        toast.error("لطفا از برنامه خارج شوید و دوباره امتحان کنید.",{
                            position: toast.POSITION.TOP_RIGHT
                        });
                      break;
                    case error.UNKNOWN_ERROR:
                        toast.error("یک خطای ناشناس رخ داده !",{
                            position: toast.POSITION.TOP_RIGHT
                        });  
                      break;
                  }
            }
        }
    },[])
    
    return(
        <>
            <div className="app">
                <DesktopView/>
            </div>
            <div className="pwa">
                <PWAPrompt 
                    promptOnVisit={1} 
                    timesToShow={3} 
                    copyClosePrompt="Close" 
                    permanentlyHideOnDismiss={false}
                />
                <Header/>
                {loading===true ?
                    <img className="logo-loading" src={logoLoading} alt="loading"/>
                :
                    <Switch>
                        <Route path="/" exact component={Login}/>
                        <PrivateRoute path="/home" component={Home}/>
                    </Switch>
                }
                {textErr && <span style={{textAlign:"center",fontSize:"12px",marginTop:"7px",color:"red"}}>دسترسی به موقعیت مکانی ناموفق بود لطفا دوباره امتحان کنید</span>}
                {location.pathname!=="/" &&
                    <Menu/>
                }
            </div>
        </>
    )
}
export default App;