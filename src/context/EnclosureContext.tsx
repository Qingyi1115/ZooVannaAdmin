import React, {
  createContext,
  useEffect,
  useReducer,
  ReactElement,
  ReactNode,
} from "react";
import Enclosure from "../models/Enclosure";

// the "objects" inside here are the objects that components can access when
// they access this context
interface CurEnclosureState {
  // user: User | null;
  curEnclosure: Enclosure | null;
}

// Define the different "actions" here for type safety
type EnclosureAction = { type: "SET_ENCLOSURE"; payload: Enclosure };

// Create context. Need to specify types because of TypeScript.
// The <...> is Type Assertion
// The part inside the () is the initial states
// dispatch is part of this so components can access the dispatch function to make changes to the state
export const EnclosureContext = createContext<{
  state: CurEnclosureState;
  dispatch: React.Dispatch<EnclosureAction>;
}>({
  state: { curEnclosure: null },
  dispatch: () => undefined,
});

// Reducer function
// Like setting the data (like the set in useState)
const authReducer = (
  state: CurEnclosureState,
  action: EnclosureAction
): CurEnclosureState => {
  switch (action.type) {
    case "SET_ENCLOSURE":
      return { curEnclosure: action.payload };
    // case "LOGIN":
    //   return { user: action.payload };
    // case "LOGOUT":
    //   return { user: null };
    default:
      return state;
  }
};

type EnclosureContextProps = {
  children: ReactNode;
};

// Context provider
// takes in an object that contains the "children" property.
// AuthContextProps is for TypeScript to verify the type
function EnclosureContextProvider({
  children,
}: EnclosureContextProps): JSX.Element {
  const [state, dispatch] = useReducer(authReducer, {
    curEnclosure: null,
  });

  // useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem("user") || "null") as User;

  //   if (user) {
  //     dispatch({ type: "LOGIN", payload: user });
  //   } else {
  //     dispatch({ type: "LOGOUT" });
  //   }
  // }, []);

  console.log("EnclosureContext state: ", state);

  return (
    <EnclosureContext.Provider value={{ state, dispatch }}>
      {children}
    </EnclosureContext.Provider>
  );
}

export default EnclosureContextProvider;
