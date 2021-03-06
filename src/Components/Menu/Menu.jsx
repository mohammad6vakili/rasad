import React,{useState} from 'react';
import "./Menu.css";
import { Button , Modal } from 'antd';
import Colors from "../../Helper/Colors";
import { useHistory , useLocation } from 'react-router';
import exitIcon from "../../Assets/images/sign-out.png";
import listIcon from "../../Assets/images/clipboard.png";
import requestIcon from "../../Assets/images/customer.png";
import submitImage from "../../Assets/images/submit.png";


const Menu=()=>{
    const history=useHistory();
    const location=useLocation();
    const [outModal , setOutModal]=useState(false);
    
    const logout=()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("aToken");
        setOutModal(false);
        history.push("/");
    }

    return(
        <div className="menu">
            <Modal
                title="" 
                visible={outModal}
                closable={false}
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
            <div 
                style={outModal===true ? {borderTop:"3px solid #001D53"}: {borderTop:"unset"}}
                onClick={()=>setOutModal(true)}
            >
                <img 
                    src={exitIcon} 
                    alt="exit" 
                />
                <span>خروج</span>
            </div>
            <div 
                style={location.pathname ==="/register" && !outModal ? {borderTop:"3px solid #001D53"}: {borderTop:"unset"}} 
                onClick={()=>history.push("/register")}
            >
                <img 
                    src={requestIcon} 
                    alt="request" 
                />
                <span>ثبت درخواست</span>
            </div>
            <div 
                style={location.pathname ==="/history" && !outModal ? {borderTop:"3px solid #001D53"}: {borderTop:"unset"}}
                onClick={()=>history.push("/history")}
            >
                <img 
                    src={listIcon} 
                    alt="list" 
                />
                <span>نمایش کارکرد</span>
            </div>
            <div 
                style={location.pathname ==="/home" && !outModal ? {borderTop:"3px solid #001D53"}: {borderTop:"unset"}}
                onClick={()=>history.push("/home")}
            >
                <img 
                    src={submitImage} 
                    alt="list" 
                />
                <span>ثبت کارکرد</span>
            </div>
        </div>
    )
}
export default Menu;