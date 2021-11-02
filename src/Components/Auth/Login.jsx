import React,{useState} from 'react';
import "./Login.css";
import { useSelector , useDispatch } from 'react-redux';
import { setUserMobile , setLoginCode} from '../../Store/Action';
import axios from "axios";
import Env from "../../Constant/Env.json";
import { useHistory } from 'react-router';
import { Input , Button, Modal , InputNumber} from 'antd';
import Colors from "../../Helper/Colors";
import PinInput from "react-pin-input";
import countDownImage from "../../Assets/images/countdown.png";
import Countdown from "react-countdown";
import FormatHepler from "../../Helper/FormatHelper";
import lockImage from "../../Assets/images/lock-icon.png";
import loadingImage from "../../Assets/animations/loading.gif";
import blueAlertImage from "../../Assets/images/blue-alert.png";


const Login=()=>{
    const history=useHistory();
    const dispatch=useDispatch();
    const mobile=useSelector(state=>state.Reducer.userMobile);
    const loginCode=useSelector(state=>state.Reducer.loginCode);
    const [loginStatus , setLoginStatus]=useState(1);
    const [loading , setLoading]=useState(false);
    const [error , setError]=useState("");
    const [errorModal , setErrorModal]=useState(false);
    const [isCount , setIsCount]=useState(false);

    const sendNumber=async(e)=>{
        e.preventDefault();
        setLoading(true);
        try{
            const response=await axios.post(Env.baseUrl + Env.version + "/Account/AuthenticationCodeRequest",
                {
                    PhoneNumber:"0" + mobile
                }
            );
            if(response.status===200){
                setLoginStatus(2);
                setIsCount(true);
                setLoading(false);
            }
        }catch({err , response}){
            setErrorModal(true);
            setLoading(false);
            setError(response.data.messages[0].message);
        }
    }

    const sendCode=async(value)=>{
        setLoading(true);
        try{
            const response = await axios.post(Env.baseUrl + "/token",`client_id=clientId%3D%3DNGRA%3D%3Dcommunity%3D%3DApps%3D%3DF47586AE-9E51-4B34-A363-E9C82F485A00&client_secret=clientSecret%3D%3DNGRA%3D%3Dcommunity%3D%3DApps%3D%3DC70D59A9-57DF-40C4-A4FB-DED05157E582&grant_type=login_code&code=${value}&phonenumber=0${mobile}`,
            {
                headers:{
                    app_token:"F868DF9E-263C-433D-B5DA-E9CC3C5D6C17",
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
            );
            if(response.status===200){
                setLoading(false);
                localStorage.setItem("token",response.data.access_token);
                localStorage.setItem("aToken",response.data.aToken);
                history.push("/home");
            }
        }catch({err , response}){
            setErrorModal(true);
            setLoading(false);
            setError(response.data.error_description);
        }
    }

    const renderer = ({ minutes, seconds}) => {
          return <span>{minutes}:{seconds}</span>;
      };

    return(
        <div className="login">
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
            {loginStatus===1 ?
                <form
                    className="send-number"
                    onSubmit={sendNumber} 
                >
                    <InputNumber
                        value={mobile}
                        autoFocus
                        className="login-input"
                        onChange={(value)=>dispatch(setUserMobile(value))}
                        placeholder="شماره موبایل"
                        pattern = "[0-9]{10}"
                    />
                    <Button 
                        htmlType="submit"
                        className={`login-button ${loading===true && "btn-loading"}`}
                        disabled={!mobile || !localStorage.getItem("lat")}
                        style={!mobile || !localStorage.getItem("lat") ? {backgroundColor:"gray",color:"white"} :{backgroundColor:Colors.royalBlue,color:"white"}}
                    >
                        {loading ===true ?
                        <div>
                            <img src={loadingImage} alt="loading" />
                            <span>لطفا منتظر بمانید</span>
                        </div>
                        :
                        <div>
                            <img src={lockImage} alt="lock" />
                            <span>ورود</span>
                        </div>
                        }
                    </Button>
                    <div className="login-under-button">
                        <span>قبل از ورود به نرم افزار باید شماره موبایل خود را به مسئول اداری مربوطه اعلام بفرمایید</span>
                        <img src={blueAlertImage} alt="alert"/>
                    </div>
                    {!localStorage.getItem("lat") &&
                        <>
                            <small style={{color:"red"}}>موقعیت مکانی شما یافت نشد</small>
                            <small style={{color:Colors.royalBlue,cursor:"pointer"}} onClick={()=>window.location.reload()}>شروع دوباره</small>
                        </>
                    }
                </form>
            :
                <form 
                    className="send-code"
                    onSubmit={sendCode}
                >
                    <span style={{fontWeight:700,fontSize:"24px",marginBottom:"10px"}}>تایید حساب کاربری</span>
                    <span style={{fontSize:"15px"}}>لطفا کد فعال سازی</span>
                    <span style={{fontSize:"15px"}}>را وارد کنید</span>
                    <PinInput 
                        length={6}
                        focus={true}
                        type="numeric"
                        inputMode="number"
                        style={loading===true ? {opacity:".2",padding: '5px',marginTop:"15px"}: {padding: '5px',marginTop:"15px"}}  
                        inputStyle={{border:"none",backgroundColor:"#001d5341",borderRadius:"6px",margin:"0 3px",width:"45px",height:"50px",color:"#001D53"}}
                        inputFocusStyle={{backgroundColor:"#001D53",color:"white"}}
                        onChange={(value) =>dispatch(setLoginCode(FormatHepler.toEnglishString(value)))}
                        onComplete={(value)=>sendCode(value)}
                        regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
                    />
                    <div className="countdown">
                        <img src={countDownImage} alt="countdown" />
                        {isCount ?
                        <span>
                            <Countdown 
                                date={Date.now() + 120000}
                                autoStart={true} 
                                zeroPadTime={2}
                                renderer={renderer}
                                onComplete={()=>setIsCount(false)}
                            />
                        </span>
                        :
                        <span onClick={sendNumber} style={{color:Colors.royalBlue,fontSize:"13px",fontWeight:900}}>ارسال مجدد کد</span>
                        }
                        <span>زمان باقی مانده</span>
                        <span>جهت دریافت پیامک</span>
                    </div>
                </form>
            }

        </div>
    )
}
export default Login;