import {
    USER_MOBILE,
    LOGIN_CODE
} from "./Action";
  
  const initialState = {
    userMobile:"",
    loginCode:""
  };
  
  const Reducer = (state = initialState, action) => {
    switch (action.type) {
      case USER_MOBILE:
        return { ...state, userMobile: action.payload };
      case LOGIN_CODE:
        return { ...state, loginCode: action.payload };
      default:
        return state;
    }
  };
  export default Reducer;
  