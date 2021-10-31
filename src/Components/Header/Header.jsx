import React from 'react';
import "./Header.css";
import headerBg from "../../Assets/images/header-bg.png";
import headerLogo from "../../Assets/images/icon_header.png";
import vectorOne from "../../Assets/images/vector-one.png";
import vectorTwo from "../../Assets/images/vector-two.png";
import vectorThree from "../../Assets/images/vector-three.png";
import vectorFour from "../../Assets/images/vector-four.png";

const Header=()=>{
    return(
        <div className="header">
            <img className="header-bg" src={headerBg} alt="header background"/>
            <div className="header-body">
                <img src={headerLogo} alt="rasad logo"/>
                <span>سامانه هوشمند رصد</span>
                <span>نسخه 1.1</span>
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