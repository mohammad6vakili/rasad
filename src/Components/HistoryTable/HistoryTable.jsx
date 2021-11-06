import React, { useEffect, useState } from 'react';
import "./HistoryTable.css";
import axios from "axios";
import Env from "../../Constant/Env.json";
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';
import * as moment from 'jalali-moment';
import { ConfigProvider, Space } from 'antd';
import { DatePicker as DatePickerJalali } from "antd-jalali";
import fa_IR from "antd/lib/locale/fa_IR";
import loadingImage from "../../Assets/animations/watting.gif";


const HistoryTable=()=>{
    const today = new Date();
    const history=useHistory();
    const [tableData , setTableData]=useState(null);
    const [empty , setEmpty]=useState(false);
    const [loading , setLoading]=useState(false);

    const getUserHistory=async(date)=>{
        console.log(date);
        const token = localStorage.getItem("token");
        const aToken = localStorage.getItem("aToken");
        try{
            setLoading(true);
            setEmpty(false);
            const response = await axios.get(Env.baseUrl + Env.version + `/attendences/getattendances?datetime=${date}`,
            {
                headers:{
                    "Authorization":"Bearer "+token,
                    "Content-Type":"application/json",
                    "aToken":aToken
                }
            }
            )
            setTableData(response.data.result);
            console.log(response.data.result);
            setLoading(false);
            if(response.data.result.length>0){
                setEmpty(false);
            }else{
                setEmpty(true);
            }
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
                    setEmpty(true);
                    setTableData(null);  
                }
            }else{
                toast.error("خطا در برقراری ارتباط",{
                    position: toast.POSITION.TOP_RIGHT
                });
                setLoading(false);
            }
        }
    }

    useEffect(()=>{
        const date = new Date();
        getUserHistory(moment(date.toString()).locale('fa').format('YYYY/M/D'));
    },[])

    return(
        <div className="history">
            <ConfigProvider locale={fa_IR}  direction="rtl">
                <DatePickerJalali
                    placeholder={moment(today.toString()).locale('fa').format('YYYY/M/D')}
                    onChange={(value)=>getUserHistory(value.$jy+"/"+(value.$jM+1)+"/"+value.$jD)}
                    style={{border:"none",width:"90%", borderBottom:"2px solid #001D53",borderRadius:"0"}} 
                />
            </ConfigProvider>
            <div className="history-list">
                {loading===false ? 
                    tableData && tableData.map((data)=>(
                        <div className="history-list-item">
                            <div>{data.clientDate}</div>
                            <div>
                                {data.type===1 && <span>ورود</span>}
                                {data.type===2 && <span>خروج</span>}
                                {data.type===5 && <span>ماموریت</span>}
                                {data.type===6 && <span>مرخصی</span>}
                            </div>
                        </div>
                    ))
                :
                    <img style={{marginTop:"50px"}} src={loadingImage} alt="loading" />
                }
            </div>
            {empty && <span style={{marginTop:"50px"}}>هیچ موردی یافت نشد</span>}
        </div>
    )
}
export default HistoryTable;