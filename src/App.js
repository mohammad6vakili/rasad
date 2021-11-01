import React, { useEffect, useState } from 'react';
import "./App.css";
import Header from './Components/Header/Header';
import Login from './Components/Auth/Login';
import Home from './Components/Home/Home';
import { useDispatch, useSelector } from 'react-redux';
import { setLat , setLong } from './Store/Action';
import DesktopView from "./Components/DesktopView/DesktopView";
import PrivateRoute from "./Helper/PrivateRoute";
import { Switch , Route } from 'react-router';
import { Modal , Button} from 'antd';
import Colors from './Helper/Colors';
import logoLoading from "./Assets/animations/ngragif.gif";


const App=()=>{
    const dispatch=useDispatch();
    const lat = useSelector(state=>state.Reducer.lat);
    const long = useSelector(state=>state.Reducer.long);
    const [error , setError]=useState("");
    const [errorModal , setErrorModal]=useState(false);
    const [textErr , setTextErr]=useState(false);
    useEffect(()=>{
        if (navigator.geolocation && window.outerWidth<=800) {
            navigator.geolocation.getCurrentPosition(setCoord,handler);
            function setCoord(position){
                dispatch(setLat(position.coords.latitude.toFixed(6)));
                dispatch(setLong(position.coords.longitude.toFixed(6)));
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
                <Modal
                    title="" 
                    visible={errorModal} 
                    onOk={()=>setErrorModal(false)} 
                    onCancel={()=>setErrorModal(false)} 
                    style={{marginBottom:"100px"}}
                    footer={[
                        <Button 
                            style={{backgroundColor:Colors.royalBlue,color:"white",borderRadius:"5px"}}
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
                {lat===null ?
                    <img className="logo-loading" src={logoLoading} alt="loading"/>
                :
                    <Switch>
                        <Route path="/" exact component={Login}/>
                        <Route path="/home" component={Home}/>
                    </Switch>
                }
                {textErr && <span>دسترسی به موقعیت مکانی ناموفق بود لطفا دوباره وارد شوید</span>}
            </div>
        </>
    )
}
export default App;