import React from 'react';
import "./DesktopView.css";
import Header from "../Header/Header";
import vector from "../../Assets/images/desktop.png";

const DesktopView=()=>{
    return(
        <div className="desktop">
            <Header/>
            <img src={vector} alt="desktop view" />
            <span>برای ورود به نرم افزار با گوشی موبایل وارد شوید</span>
        </div>
    )
}
export default DesktopView;