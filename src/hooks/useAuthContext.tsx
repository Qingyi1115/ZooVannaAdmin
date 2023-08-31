import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export const useAuthContext = () => {
  const authContext = useContext(AuthContext);

  // check scope
  if (!authContext) {
    throw Error("useAuthContext must be used inside an AuthContextProvider");
  }

  return authContext;
};
