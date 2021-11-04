import React,{useState} from 'react';
import "./Menu.css";
import { Button , Modal } from 'antd';
import Colors from "../../Helper/Colors";
import { useHistory } from 'react-router';
import exitIcon from "../../Assets/images/sign-out.png";
import listIcon from "../../Assets/images/clipboard.png";
import requestIcon from "../../Assets/images/customer.png";


const Menu=()=>{
    const history=useHistory();
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
            <div onClick={()=>setOutModal(true)}>
                <img 
                    src={exitIcon} 
                    alt="exit" 
                />
                <span>خروج</span>
            </div>
            <div>
                <img 
                    src={requestIcon} 
                    alt="request" 
                />
                <span>ثبت اصلاحیه</span>
            </div>
            <div>
                <img 
                    src={listIcon} 
                    alt="list" 
                />
                <span>نمایش کارکرد</span>
            </div>
        </div>
    )
}
export default Menu;