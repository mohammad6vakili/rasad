export const USER_MOBILE="USER_MOBILE";


export const setUserMobile=(mobile)=>{
    return(
        {
            type:USER_MOBILE,
            payload:mobile
        }
    )
}