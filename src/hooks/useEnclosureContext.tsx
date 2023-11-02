import { EnclosureContext } from "../context/EnclosureContext";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export const useEnclosureContext = () => {
  const enclosureContext = useContext(EnclosureContext);

  // check scope
  if (!enclosureContext) {
    throw Error(
      "enclosureContext must be used inside an EnclosureContextProvider"
    );
  }

  return enclosureContext;
};
