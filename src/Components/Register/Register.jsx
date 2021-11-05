import React, { useState } from 'react';
import "./Register.css";
import axios from 'axios';
import Env from "../../Constant/Env.json";
import { toast } from 'react-toastify';
import { Button , TimePicker , Radio , Input } from 'antd';
import * as moment from 'jalali-moment';
import { useHistory } from 'react-router';
import { ConfigProvider, Space } from 'antd';
import { DatePicker as DatePickerJalali } from "antd-jalali";
import fa_IR from "antd/lib/locale/fa_IR";
import loadingImage from "../../Assets/animations/watting.gif";
const {TextArea}=Input;


const Register=()=>{
    var date = new Date();
    const history=useHistory();
    const [start , setStart]=useState(null);
    const [end , setEnd]=useState(null);
    const [target , setTarget]=useState(moment(date.toString()).locale('fa').format('YYYY/M/D'));
    const [type , setType]=useState(0);
    const [note , setNote]=useState("");
    const [loading , setLoading]=useState(false);

    const format = 'HH:mm';

    const submitRegister=async(e)=>{
        console.log(start , end , target , type);
        e.preventDefault();
        const token = localStorage.getItem("token");
        const aToken = localStorage.getItem("aToken");
        if(start===null){
            toast.warning("زمان شروع را وارد کنید",{
                position: toast.POSITION.TOP_RIGHT
            });
        }else if(end===null){
            toast.warning("زمان پایان را وارد کنید",{
                position: toast.POSITION.TOP_RIGHT
            });
        }else if(note.length<=3){
            toast.warning("توضیحات باید بیش از سه حرف باشد",{
                position: toast.POSITION.TOP_RIGHT
            });
        }else{
            try{
                setLoading(true);
                const response = await axios.post(Env.baseUrl + Env.version + "/attendences/RegisterNewAmendmentRequest",
                {
                    Start: start,
                    End: end,
                    TargetDate: target,
                    Type: type, //0 Mission 1 Vacation
                    Note:note
                },
                {
                    headers:{
                        "Authorization":"Bearer "+token,
                        "Content-Type":"application/json",
                        "aToken":aToken
                    }
                }
                )
                console.log(response.data);
                setLoading(false);
            }catch({err , response}){
                if(response){
                    if(response.data.message==="Authorization has been denied for this request."||response.status===401){
                        toast.error("کاربر یافت نشد",{
                            position: toast.POSITION.TOP_RIGHT
                        });
                        localStorage.clear();
                        history.push("/");
                        setLoading(false);
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
                    setLoading(false);
                }
            }
        }
    }

    return(
        <form style={loading===true ? {opacity:".3"}:{opacity:"1"}} onSubmit={submitRegister} className="register">
            <div>
                <TimePicker 
                    onChange={(time,timeString)=>setEnd(timeString)} 
                    defaultOpenValue={moment('00:00', 'HH:mm')}
                    placeholder={"زمان پایان"}
                    format={format}
                />
                <TimePicker 
                    onChange={(time,timeString)=>setStart(timeString)} 
                    defaultOpenValue={moment('00:00', 'HH:mm')}
                    placeholder={"زمان شروع"}
                    format={format}
                />
            </div>
            <div>
                <ConfigProvider locale={fa_IR}  direction="rtl">
                    <DatePickerJalali
                        placeholder={"تاریخ"}
                        onChange={(value)=>setTarget(value.$jy+"/"+(value.$jM+1)+"/"+value.$jD)}
                        style={{border:"none",width:"100%",border:"1px solid #d9d9d9",borderRadius:"0"}} 
                    />
                </ConfigProvider>
            </div>
            <div>
                <TextArea
                    onChange={(e)=>setNote(e.target.value)}
                    placeholder="توضیحات (بیش از سه حرف)"
                    style={{fontSize:"12px",textAlign:"right"}}
                />
            </div>
            <div>
                <Radio.Group defaultValue={0} onChange={(e)=>setType(e.target.value)}>
                    <Radio value={0}>ماموریت</Radio>
                    <Radio value={1}>مرخصی</Radio>
                </Radio.Group>
            </div>
            <Button htmlType="submit">ثبت درخواست</Button>
        </form>
    )
}
export default Register;