import React, { useEffect, useState } from 'react';
import "./App.css";
import Header from './Components/Header/Header';
import Login from './Components/Auth/Login';
import Home from './Components/Home/Home';
import { useHistory } from 'react-router';
import DesktopView from "./Components/DesktopView/DesktopView";
import PrivateRoute from "./Helper/PrivateRoute";
import { Switch , Route } from 'react-router';
import { Modal , Button} from 'antd';
import Colors from './Helper/Colors';
import logoLoading from "./Assets/animations/ngragif.gif";
import { toast } from 'react-toastify';
import PWAPrompt from 'react-ios-pwa-prompt';

const App=()=>{
    const history=useHistory();
    const lat = localStorage.getItem("lat");
    const long = localStorage.getItem("long");
    const [loading , setLoading]=useState(lat ? false : true);
    const [error , setError]=useState("");
    const [errorModal , setErrorModal]=useState(false);
    const [textErr , setTextErr]=useState(false);

    useEffect(()=>{
        // toast.error("mioo",{
        //     position: toast.POSITION.BOTTOM_LEFT
        // });
        if(localStorage.getItem("token")){
            history.push("/home");
        }
        if (navigator.geolocation && window.outerWidth<=800 && !lat && !long) {
            navigator.geolocation.getCurrentPosition(setCoord,handler);
            function setCoord(position){
                localStorage.setItem("lat",position.coords.latitude.toFixed(6));
                localStorage.setItem("long",position.coords.longitude.toFixed(6));
                setLoading(false);
                setTextErr(false);
                setErrorModal(false);
            }
            function handler(error){
                setErrorModal(true);
                setTextErr(true);
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        setError("برای استفاده از نرم افزار نیاز به دسترسی موقعیت مکانی میباشد.لطفا خارج شوید و دوباره وارد شوید یا صفحه را رفرش کنید")
                      break;
                    case error.POSITION_UNAVAILABLE:
                        setError("موقعیت جغرافیایی ناشناس میباشد.");
                      break;
                    case error.TIMEOUT:
                      setError("لطفا از برنامه خارج شوید و دوباره امتحان کنید.");
                      break;
                    case error.UNKNOWN_ERROR:
                      setError("یک خطای ناشناس رخ داده !");
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
                <Modal
                    title="" 
                    visible={errorModal} 
                    onOk={()=>setErrorModal(false)} 
                    onCancel={()=>setErrorModal(false)} 
                    style={{marginBottom:"100px"}}
                    footer={[
                        <Button 
                            style={{backgroundColor:Colors.royalBlue,color:"white",borderRadius:"5px",border:"none"}}
                            onClick={()=>setErrorModal(false)}
                        >
                            بستن
                        </Button>
                    ]}
                >
                    <div className="login-modal-content">
                        {error}
                    </div>
                </Modal>
                <Header/>
                {loading===true ?
                    <img className="logo-loading" src={logoLoading} alt="loading"/>
                :
                    <Switch>
                        <Route path="/" exact component={Login}/>
                        <PrivateRoute path="/home" component={Home}/>
                    </Switch>
                }
                {textErr && <span>دسترسی به موقعیت مکانی ناموفق بود لطفا دوباره وارد شوید</span>}
            </div>
        </>
    )
}
export default App;