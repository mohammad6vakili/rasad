import React,{useState} from 'react';
import "./Login.css";
import { useSelector , useDispatch } from 'react-redux';
import { setUserMobile , setLoginCode} from '../../Store/Action';
import axios from "axios";
import Env from "../../Constant/Env.json";
import { Input , Button, Modal } from 'antd';
import Colors from "../../Helper/Colors";
import PinInput from "react-pin-input";
import countDownImage from "../../Assets/images/countdown.png";
import Countdown from "react-countdown";
import FormatHepler from "../../Helper/FormatHelper";
import lockImage from "../../Assets/images/lock-icon.png";
import loadingImage from "../../Assets/animations/loading.gif";

const Login=()=>{

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
                    PhoneNumber:mobile
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

    const sendCode=async()=>{
        try{
            const response = await axios.post(Env.baseUrl + "/token",
            {
                client_id:"clientId==NGRA==community==Apps==F47586AE-9E51-4B34-A363-E9C82F485A00",
                client_secret:"clientSecret==NGRA==community==Apps==C70D59A9-57DF-40C4-A4FB-DED05157E582",
                grant_type:"login_code",
                code:loginCode,
                phonenumber:mobile
            },
            {
                headers:{
                    app_token:"F868DF9E-263C-433D-B5DA-E9CC3C5D6C17",
                }
            }
            );
            console.log(response);
        }catch({err , response}){
            setErrorModal(true);
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
            {loginStatus===1 ?
                <form
                    className="send-number"
                    onSubmit={sendNumber} 
                >
                    <Input
                        className="login-input"
                        placeholder="شماره موبایل"
                        onChange={(e)=>dispatch(setUserMobile(FormatHepler.toEnglishString(e.target.value)))}
                        autoFocus
                        required
                        pattern = "[0-9]{11}"
                    />
                    <Button 
                        htmlType="submit"
                        className={`login-button ${loading===true && "btn-loading"}`}
                        disabled={mobile===""}
                        style={mobile.length < 11 ? {backgroundColor:"gray",color:"white"} :{backgroundColor:Colors.royalBlue,color:"white"}}
                    >
                        {loading ===true ?
                        <>
                            <img style={{position:"absolute",left:"10px",top:"13px",width:"20px"}} src={loadingImage} alt="loading" />
                            <span>لطفا منتظر بمانید</span>
                        </>
                        :
                        <>
                            <img style={{position:"absolute",left:"10px",top:"12px",width:"20px"}} src={lockImage} alt="lock" />
                            <span>ورود</span>
                        </>
                        }
                    </Button>
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
                        style={{padding: '5px',marginTop:"15px"}}  
                        inputStyle={{border:"none",backgroundColor:"#001d5341",borderRadius:"6px",margin:"0 3px",width:"45px",height:"50px",color:"#001D53"}}
                        inputFocusStyle={{backgroundColor:"#001D53",color:"white"}}
                        onChange={(value) =>dispatch(setLoginCode(FormatHepler.toEnglishString(value)))}
                        onComplete={sendCode}
                        regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
                    />
                    <div className="countdown">
                        <img src={countDownImage} alt="countdown" />
                        {isCount ?
                        <span>
                            <Countdown 
                                date={Date.now() + 60000}
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