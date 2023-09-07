import React from "react";
import { useAuthContext } from "./useAuthContext";

function useLogout() {
  const { dispatch } = useAuthContext();
  function logout() {
    // update local state, and delete token

    // remove user from local storage
    localStorage.removeItem("user");

    // dispatch logout action
    dispatch({ type: "LOGOUT" });
  }

  return { logout };
}

export default useLogout;
