import {
    USER_MOBILE,
} from "./Action";
  
  const initialState = {
    userMobile: "",
  };
  
  const Reducer = (state = initialState, action) => {
    switch (action.type) {
      case USER_MOBILE:
        return { ...state, userMobile: action.payload };
      default:
        return state;
    }
  };
  export default Reducer;
  