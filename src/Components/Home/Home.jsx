import React, { useEffect, useState } from 'react';
import "./Home.css";
import internetImage from "../../Assets/images/internet.png";
import locationImage from "../../Assets/images/location.png";
import loginImage from "../../Assets/images/login-submit.png";
import exitImage from "../../Assets/images/exit-submit.png";
import axios from 'axios';
import Env from "../../Constant/Env.json";
import { useDispatch , useSelector} from 'react-redux';
import { useHistory } from 'react-router';
import { setUserStatus } from '../../Store/Action';
import { Modal , Button , Input } from 'antd';
import Colors from "../../Helper/Colors";
import loadingImage from "../../Assets/animations/watting.gif";
import circleLoadingImage from "../../Assets/animations/loading.gif";
import { toast } from 'react-toastify';


const Home=()=>{
    const dispatch=useDispatch();
    const history=useHistory();
    const userStatus=useSelector(state=>state.Reducer.userStatus);
    const [viewCode , setViewCode]=useState(false);
    const [loading , setLoading]=useState(false);
    const [pin , setPin]=useState("");
    const [locationUpdate , setLocationUpdate]=useState(false);

    const getLocation=async()=>{
        if (navigator.geolocation && window.outerWidth<=800) {
            navigator.geolocation.getCurrentPosition(setCoord,handler);
            function setCoord(position){
                localStorage.setItem("lat",position.coords.latitude.toFixed(6));
                localStorage.setItem("long",position.coords.longitude.toFixed(6));
                setLocationUpdate(true);
                applyRequest();
            }
            function handler(error){
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
        }else{
            toast.error("دسترسی به موقعیت مکانی شما.لطفا لوکیشن دستگاه خود را روشن کنید",{
                position: toast.POSITION.TOP_RIGHT
            });  
        }
    }
    
    const getUserStatus=async()=>{
        const token = localStorage.getItem("token");
        const aToken = localStorage.getItem("aToken");
        try{
            const response = await axios.get(Env.baseUrl + Env.version + "/deviceattendance/PersonnelStatus",
            {
                headers:{
                    "Authorization":"Bearer "+token,
                    "Content-Type":"application/json",
                    "aToken":aToken
                }
            }
            )
            dispatch(setUserStatus(response.data.result.status));
        }catch({err , response}){
            if(response){
                if(response.data.message==="Authorization has been denied for this request."||response.status===401){
                    toast.error("کاربر یافت نشد",{
                        position: toast.POSITION.TOP_RIGHT
                    });  
                    localStorage.clear();
                    history.push("/");
                }
            }else{
                toast.error("خطا در برقراری ارتباط",{
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        }
    }

    const applyRequest=async()=>{
        setLoading(true);
        const token = localStorage.getItem("token");
        const aToken = localStorage.getItem("aToken");
            try{
                const response = await axios.post(Env.baseUrl + Env.version + "/attendences/applyrequest",
                {
                }
                ,
                {
                    headers:{
                        "Authorization":"Bearer "+token,
                        "Content-Type":"application/json",
                        "aToken":aToken
                    }
                }
                )
                console.log(response.data);
                if(response.status===200){
                    setViewCode(true);
                    setLoading(false);
                    setLocationUpdate(false);
                }
            }catch({err , response}){
                setLoading(false);
                if(response){
                    if(response.data.message==="Authorization has been denied for this request."||response.status===401){
                        toast.error("کاربر یافت نشد",{
                            position: toast.POSITION.TOP_RIGHT
                        });  
                        localStorage.clear();
                        history.push("/");
                    }
                }else{
                    toast.error("خطا در برقراری ارتباط",{
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
            }
    }

    const submitRequest=async(e)=>{
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem("token");
        const aToken = localStorage.getItem("aToken");
        try{
            const response = await axios.post(Env.baseUrl + Env.version + "/attendences/submit",
            {
                "Latitude":localStorage.getItem("lat"),
                "Longitude":localStorage.getItem("long"),
                "code":pin
            }
            ,
            {
                headers:{
                    "Authorization":"Bearer "+token,
                    "Content-Type":"application/json",
                    "aToken":aToken
                }
            }
            )
            console.log(response.data);
            if(response.status===200){
                getUserStatus();
                setViewCode(false);
                setLoading(false);
                setPin("");
            }
        }catch({err , response}){
            setLoading(false);
            if(response){
                if(response.data.message==="Authorization has been denied for this request."||response.status===401){
                    toast.error("کاربر یافت نشد",{
                        position: toast.POSITION.TOP_RIGHT
                    });  
                    localStorage.clear();
                    history.push("/");
                }else{
                    response.data.messages.map((m)=>{
                        toast.error(m.message,{
                            position: toast.POSITION.TOP_RIGHT
                        });
                    })
                    setLoading(false);
                }
            }else{
                toast.error("خطا در برقراری ارتباط",{
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        }
    }

    useEffect(()=>{
        getUserStatus();
    },[])


    return(
        <div className="home">
            <Modal
                title="لطفا کد ارسال شده را وارد کنید" 
                visible={viewCode}
                closable={false}
                onOk={()=>setViewCode(false)} 
                onCancel={()=>setViewCode(false)} 
                style={{marginBottom:"100px"}}
                footer={[
                    // <Button 
                    //     style={{backgroundColor:Colors.royalBlue,color:"white",borderRadius:"5px",border:"none"}}
                    //     onClick={()=>setViewCode(false)}
                    // >
                    //     بستن
                    // </Button>
                ]}
            >
                <form 
                    onSubmit={submitRequest} 
                    className="home-modal-content" 
                    style={{padding:"0"}}
                >
                    <Input
                        type="tel"
                        value={pin}
                        autoFocus={true}
                        style={loading===true ? {opacity:".2",marginTop:"15px"}: {marginTop:"15px"}}  
                        onChange={(e) =>setPin((e.target.value))}
                        className="login-input"
                    />
                    <Button 
                        htmlType="submit"
                        className={`login-button ${loading===true && "btn-loading"}`}
                        disabled={pin==="null" || pin===""||pin.length<6}
                        style={pin==="null" || pin==="" || pin.length<6 ? {backgroundColor:"gray",color:"white"} :{backgroundColor:Colors.royalBlue,color:"white"}}
                    >
                        {loading ===true ?
                            <div>
                                <img src={circleLoadingImage} alt="loading" />
                                <span>لطفا منتظر بمانید</span>
                            </div>
                            :
                            <div>
                                <span>ثبت</span>
                            </div>
                        }
                    </Button>
                </form>
                    {/* <PinInput 
                        length={6}
                        focus
                        initialValue=""
                        type="numeric"
                        inputMode="number"
                        style={loading===true ? {opacity:".2",marginTop:"15px"}: {marginTop:"15px"}}  
                        inputStyle={{border:"none",backgroundColor:"#001d5341",borderRadius:"6px",margin:"0 3px",width:"40px",height:"45px",color:"#001D53"}}
                        inputFocusStyle={{backgroundColor:"#001D53",color:"white"}}
                        ref={p => setPin(p)}
                        onComplete={(value)=>submitRequest(value)}
                        regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
                    /> */}
            </Modal>
            <div className="home-status">
                <div>
                    <img src={internetImage} alt="internet status" />
                    <span>اینترنت</span>
                </div>
                <div>
                    <img src={locationImage} alt="location access" />
                    <span>موقعیت مکانی</span>
                </div>
            </div>
            <div className="home-action-button-wrapper">
                {userStatus===0 &&
                    <div onClick={getLocation} style={{backgroundColor:Colors.royalBlue}}>
                        {loading===false ?
                        <>
                            <img src={loginImage} alt="enter submit" />
                            <span>ثبت ورود</span>
                        </>
                        :
                            <img style={{width:"30%"}} src={circleLoadingImage} alt="loading" />
                        }
                    </div>
                }
                {userStatus===1 &&
                    <div onClick={getLocation} style={{backgroundColor:"red"}}>
                        {loading===false ?
                        <>
                            <img src={exitImage} alt="exit submit" />
                            <span>ثبت خروج</span>
                        </>
                        :
                            <img style={{width:"30%"}} src={circleLoadingImage} alt="loading" />
                        }
                    </div>
                }
                {userStatus===null &&
                    <img style={{width:"40%"}} src={loadingImage} alt="loading" />
                }
            </div>
        </div>
    )
}
export default Home;