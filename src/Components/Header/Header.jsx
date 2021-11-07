import React, { useState } from 'react';
import "./Header.css";
import { useLocation , useHistory} from 'react-router';
import { Modal , Button} from 'antd';
import Colors from "../../Helper/Colors";
import headerBg from "../../Assets/images/header-bg.png";
import headerLogo from "../../Assets/images/icon_header.png";


const Header=()=>{

    return(
        <div className="header">
            <img className="header-bg" src={headerBg} alt="header background"/>
            <div className="header-body">
                <img src={headerLogo} alt="rasad logo"/>
                <span>سامانه هوشمند رصد</span>
                <span>ویرایش ۱.۵</span>
                <div className="vector-area">
                    <div>N</div>
                    <div>G</div>
                    <div>R</div>
                    <div>A</div>
                </div>
            </div>
        </div>
    )
}
export default Header;