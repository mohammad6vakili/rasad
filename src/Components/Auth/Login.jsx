import React,{useState} from 'react';
import "./Login.css";
import { useSelector , useDispatch } from 'react-redux';
import { setUserMobile , setLoginCode} from '../../Store/Action';
import axios from "axios";
import Env from "../../Constant/Env.json";
import { Input , Button, Modal } from 'antd';
import Colors from "../../Helper/Colors";
import PinInput from "react-pin-input";

const Login=()=>{

    const dispatch=useDispatch();
    const mobile=useSelector(state=>state.Reducer.userMobile);
    const loginCode=useSelector(state=>state.Reducer.loginCode);

    const [loginStatus , setLoginStatus]=useState(1);
    const [loading , setLoading]=useState(false);
    const [error , setError]=useState("");
    const [errorModal , setErrorModal]=useState(false);

    const sendNumber=async(e)=>{
        e.preventDefault();
        try{
            const response=await axios.post(Env.baseUrl + Env.version + "/Account/AuthenticationCodeRequest",
                {
                    PhoneNumber:mobile
                }
            );
            if(response.status===200){
                setLoginStatus(2);
            }
        }catch({err , response}){
            setErrorModal(true);
            setError(response.data.messages[0].message);
        }
    }

    const sendCode=async(e)=>{
        e.preventDefault();
        try{
            const response = await axios.post(Env.baseUrl + "/token",{
                client_id:"clientId==NGRA==community==Apps==F47586AE-9E51-4B34-A363-E9C82F485A00",
                client_secret:"clientSecret==NGRA==community==Apps==C70D59A9-57DF-40C4-A4FB-DED05157E582",
                grant_type:"login_code",
                code:loginCode,
                phonenumber:mobile
            });
            console.log(response);
        }catch({err , response}){
            setErrorModal(true);
            setError(response.data.messages[0].message);
        }
    }

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
                        style={{backgroundColor:Colors.royalBlue,color:"white"}}
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
                        onChange={(e)=>dispatch(setUserMobile(e.target.value))}
                        autoFocus
                        required
                        pattern = "[0-9]{11}"
                    />
                    <Button 
                        htmlType="submit"
                        className="login-button"
                        disabled={mobile===""}
                        style={mobile.length < 11 ? {backgroundColor:"gray",color:"white"} :{backgroundColor:Colors.royalBlue,color:"white"}}
                    >
                        ورود
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
                        style={{padding: '5px'}}  
                        inputStyle={{border:"none",backgroundColor:"#001d5341",borderRadius:"6px",margin:"0 3px",width:"45px",height:"50px",color:"#001D53"}}
                        inputFocusStyle={{backgroundColor:"#001D53",color:"white"}}
                        // onChange={(value) =>dispatch(setVerifyCode(FormatHepler.toEnglishString(value)))}
                        // onComplete={(value) =>dispatch(setVerifyCode(FormatHepler.toEnglishString(value)))}
                        regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
                    />
                </form>
            }

        </div>
    )
}
export default Login;