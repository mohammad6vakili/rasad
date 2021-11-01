export const USER_MOBILE="USER_MOBILE";
export const LOGIN_CODE="LOGIN_CODE";
export const LAT="LAT";
export const LONG="LONG";


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
export const setLat=(data)=>{
    return(
        {
            type:LAT,
            payload:data
        }
    )
}
export const setLong=(data)=>{
    return(
        {
            type:LONG,
            payload:data
        }
    )
}