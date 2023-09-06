import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import React, { useState } from "react";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MainLayout from "./components/MainLayout";

function App() {
  const { state } = useAuthContext();
  const { user } = state;

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  return (
    <div className="App font-inter">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <MainLayout
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                >
                  <HomePage />
                </MainLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
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
