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
import { Modal , Button } from 'antd';
import Colors from "../../Helper/Colors";
import loadingImage from "../../Assets/animations/watting.gif";
import circleLoadingImage from "../../Assets/animations/loading.gif";
import PinInput from "react-pin-input";


const Home=()=>{
    const dispatch=useDispatch();
    const history=useHistory();
    const userStatus=useSelector(state=>state.Reducer.userStatus);
    const [errorModal , setErrorModal]=useState(false);
    const [error , setError]=useState("");
    const [viewCode , setViewCode]=useState(false);
    const [loading , setLoading]=useState(false);
    const [outModal , setOutModal]=useState(false);
    
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
            setErrorModal(true);
            if(response.data.message==="Authorization has been denied for this request."){
                setError("کاربر یافت نشد");
                setErrorModal(true);
                localStorage.removeItem("token");
                localStorage.removeItem("aToken");
                localStorage.removeItem("lat");
                localStorage.removeItem("long");
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
            }
        }catch({err , response}){
            setLoading(false);
            setErrorModal(true);
            if(response.data.message==="Authorization has been denied for this request."){
                setError("کاربر یافت نشد");
                setErrorModal(true);
                localStorage.removeItem("token");
                localStorage.removeItem("aToken");
                localStorage.removeItem("lat");
                localStorage.removeItem("long");
            }
        }
    }

    const submitRequest=async(value)=>{
        setLoading(true);
        const token = localStorage.getItem("token");
        const aToken = localStorage.getItem("aToken");
        try{
            const response = await axios.post(Env.baseUrl + Env.version + "/attendences/submit",
            {
                "Latitude":localStorage.getItem("lat"),
                "Longitude":localStorage.getItem("long"),
                "code":value
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
                setOutModal(true);
            }
        }catch({err , response}){
            setErrorModal(true);
            if(response.data.message==="Authorization has been denied for this request."){
                setError("کاربر یافت نشد");
                setLoading(false);
                setErrorModal(true);
                localStorage.removeItem("token");
                localStorage.removeItem("aToken");
                localStorage.removeItem("lat");
                localStorage.removeItem("long");
            }
        }
    }
    const logOut=()=>{
        localStorage.clear();
        history.push("/");
    }
    useEffect(()=>{
        getUserStatus();
    },[])

    return(
        <div className="home">
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
            <Modal
                title="لطفا کد ارسال شده را وارد کنید" 
                visible={viewCode} 
                onOk={()=>setViewCode(false)} 
                onCancel={()=>setViewCode(false)} 
                style={{marginBottom:"100px"}}
                footer={[
                    <Button 
                        style={{backgroundColor:Colors.royalBlue,color:"white",borderRadius:"5px",border:"none"}}
                        onClick={()=>setViewCode(false)}
                    >
                        بستن
                    </Button>
                ]}
            >
                <div className="login-modal-content" style={{padding:"0"}}>
                    <PinInput 
                        length={6}
                        focus={true}
                        type="numeric"
                        inputMode="number"
                        style={loading===true ? {opacity:".2",marginTop:"15px"}: {marginTop:"15px"}}  
                        inputStyle={{border:"none",backgroundColor:"#001d5341",borderRadius:"6px",margin:"0 3px",width:"40px",height:"45px",color:"#001D53"}}
                        inputFocusStyle={{backgroundColor:"#001D53",color:"white"}}
                        onComplete={(value)=>submitRequest(value)}
                        regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
                    />
                </div>
            </Modal>
            <Modal
                title="" 
                visible={outModal} 
                onOk={()=>setOutModal(false)} 
                onCancel={()=>setOutModal(false)} 
                style={{marginBottom:"100px"}}
                footer={[
                    <Button 
                        style={{backgroundColor:"red",color:"white",borderRadius:"5px",border:"none"}}
                        onClick={()=>setOutModal(false)}
                        onClick={logOut}
                    >
                        خروج
                    </Button>
                ]}
            >
                <div className="login-modal-content">
                    موقعیت شما با موفقیت ارسال شد . میتوانید از برنامه خارج شوید
                </div>
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
                    <div onClick={applyRequest} style={{backgroundColor:Colors.royalBlue}}>
                        {loading===false ?
                        <>
                            <img src={loginImage} alt="enter submit" />
                            <span style={{marginTop:"5px"}}>ثبت ورود</span>
                        </>
                        :
                            <img style={{width:"30%"}} src={circleLoadingImage} alt="loading" />
                        }
                    </div>
                }
                {userStatus===1 &&
                    <div onClick={applyRequest} style={{backgroundColor:"red"}}>
                        {loading===false ?
                        <>
                            <img src={exitImage} alt="exit submit" />
                            <span style={{marginTop:"5px"}}>ثبت خروج</span>
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