import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import React from "react";

import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";

function App() {
  const { state } = useAuthContext();
  const { user } = state;

  return (
    <div className="App font-inter">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={user ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to={"/"} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
