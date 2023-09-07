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
import ViewAllSpeciesPage from "./pages/speciesManagement/ViewAllSpeciesPage";
import CreateNewSpeciesPage from "./pages/speciesManagement/CreateNewSpeciesPage";

function App() {
  const { state } = useAuthContext();
  const { user } = state;

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  return (
    <div className="App bg-zoovanna-cream font-inter">
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to={"/"} />}
          />
        </Routes>
        <MainLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
          <Routes>
            <Route>
              <Route
                path="/"
                element={user ? <HomePage /> : <Navigate to="/login" />}
              />
              {/* Species Management */}
              <Route
                path="/viewallspecies"
                element={
                  user ? <ViewAllSpeciesPage /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/createspecies"
                element={
                  user ? <CreateNewSpeciesPage /> : <Navigate to="/login" />
                }
              />
            </Route>
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </div>
  );
}

export default App;
