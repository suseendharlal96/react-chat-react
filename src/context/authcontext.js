import React, { useContext, useReducer, createContext } from "react";

const AuthStateContext = createContext();
const AuthDispatchContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "SIGNUP":
      console.log(1, action.userData);
      localStorage.setItem("token", action.userData.token);
      return {
        ...state,
        user: action.userData,
      };
    case "LOGIN":
      console.log(2, action.userData);
      localStorage.setItem("token", action.userData.token);
      return {
        ...state,
        user: action.userData,
      };
    case "LOGOUT":
      // localStorage.removeItem("token");
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoaded: false,
  });
  return (
    <AuthDispatchContext.Provider value={dispatch}>
      <AuthStateContext.Provider value={state}>
        {children}
      </AuthStateContext.Provider>
    </AuthDispatchContext.Provider>
  );
};

export const useAuthState = () => useContext(AuthStateContext);
export const useAuthDispatch = () => useContext(AuthDispatchContext);
