import React, { useState } from 'react';
import "./Header.css";
import { useLocation , useHistory} from 'react-router';
import { Modal , Button} from 'antd';
import Colors from "../../Helper/Colors";
import headerBg from "../../Assets/images/header-bg.png";
import headerLogo from "../../Assets/images/icon_header.png";
import vectorOne from "../../Assets/images/vector-one.png";
import vectorTwo from "../../Assets/images/vector-two.png";
import vectorThree from "../../Assets/images/vector-three.png";
import vectorFour from "../../Assets/images/vector-four.png";
import exitIcon from "../../Assets/images/exit.svg";


const Header=()=>{
    const location=useLocation();
    const history=useHistory();
    const [outModal , setOutModal]=useState(false);
    const logout=()=>{
        localStorage.clear();
        setOutModal(false);
        history.push("/");
    }
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
                {location.pathname==="/home" &&
                    <img 
                        onClick={()=>setOutModal(true)}
                        className="header-exit-icon" 
                        src={exitIcon} 
                        alt="exit" 
                    />
                }
            <Modal
                title="" 
                visible={outModal} 
                onOk={logout} 
                onCancel={()=>setOutModal(false)} 
                style={{marginBottom:"100px"}}
                footer={[
                    <>
                        <Button 
                            style={{backgroundColor:Colors.danger,color:"white",borderRadius:"5px",border:"none"}}
                            onClick={logout}
                        >
                            خروج
                        </Button>
                        <Button 
                            style={{backgroundColor:Colors.secondary,color:"black",borderRadius:"5px",border:"none"}}
                            onClick={()=>setOutModal(false)}
                        >
                            انصراف
                        </Button>
                    </>
                ]}
            >
                <div className="login-modal-content" style={{padding:"0"}}>
                آیا مطمئن هستید میخواهید خارج شوید؟
                </div>
            </Modal>
            </div>
        </div>
    )
}
export default Header;