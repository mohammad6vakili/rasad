import {
    USER_MOBILE,
    LOGIN_CODE,
    LAT,
    LONG
} from "./Action";
  
  const initialState = {
    userMobile:"",
    loginCode:"",
    lat:null,
    long:null
  };
  
  const Reducer = (state = initialState, action) => {
    switch (action.type) {
      case USER_MOBILE:
        return { ...state, userMobile: action.payload };
      case LOGIN_CODE:
        return { ...state, loginCode: action.payload };
      case LAT:
        return {...state , lat: action.payload};
      case LONG:
        return {...state , long: action.payload};
      default:
        return state;
    }
  };
  export default Reducer;
  