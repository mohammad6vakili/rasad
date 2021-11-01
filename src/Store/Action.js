export const USER_MOBILE="USER_MOBILE";
export const LOGIN_CODE="LOGIN_CODE";


export const setUserMobile=(data)=>{
    return(
        {
            type:USER_MOBILE,
            payload:data
        }
    )
}
export const setLoginCode=(data)=>{
    return(
        {
            type:LOGIN_CODE,
            payload:data
        }
    )
}