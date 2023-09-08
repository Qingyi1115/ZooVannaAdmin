import React, {
  createContext,
  useEffect,
  useReducer,
  ReactElement,
  ReactNode,
} from "react";

// Structure of objects that can be accessed
interface User {
  email: string;
  token: string;
}

// the "objects" inside here are the objects that components can access when
// they access this context
interface AuthState {
  user: User | null;
}

// Define the different "actions" here for type safety
type AuthAction = { type: "LOGIN"; payload: User } | { type: "LOGOUT" };

// Create context. Need to specify types because of TypeScript.
// The <...> is Type Assertion
// The part inside the () is the initial states
// dispatch is part of this so components can access the dispatch function to make changes to the state
export const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}>({
  state: { user: null },
  dispatch: () => undefined,
});

// Reducer function
// Like setting the data (like the set in useState)
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};

type AuthContextProps = {
  children: ReactNode;
};

// Context provider
// takes in an object that contains the "children" property.
// AuthContextProps is for TypeScript to verify the type
function AuthContextProvider({ children }: AuthContextProps): JSX.Element {
  const [state, dispatch] = useReducer(authReducer, {
    user: JSON.parse(localStorage.getItem("user") || "null"),
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null") as User;

    if (user) {
      dispatch({ type: "LOGIN", payload: user });
    }
  }, []);

  console.log("AuthContext state: ", state);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
