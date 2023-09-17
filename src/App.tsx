import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import React, { useState } from "react";

import { PrimeReactProvider, PrimeReactContext } from "primereact/api";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MainLayout from "./components/MainLayout";
import ViewAllSpeciesPage from "./pages/speciesManagement/ViewAllSpeciesPage";
import CreateNewSpeciesPage from "./pages/speciesManagement/CreateNewSpeciesPage";
import CreateNewFacilityPage from "./pages/assetAndFacilityManagement/CreateNewFacilityPage";
import EditSpeciesPage from "./pages/speciesManagement/EditSpeciesPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const { state } = useAuthContext();
  const { user } = state;

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  return (
    <PrimeReactProvider>
      <div className="App bg-whiter font-inter">
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
                {/* Home page */}
                <Route
                  path="/"
                  element={user ? <HomePage /> : <Navigate to="/login" />}
                />
                {/* Species Management */}
                <Route
                  path="/species/viewallspecies"
                  element={
                    user ? <ViewAllSpeciesPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/species/createspecies"
                  element={
                    user ? <CreateNewSpeciesPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/species/editspecies/:speciesId"
                  element={
                    user ? <EditSpeciesPage /> : <Navigate to="/login" />
                  }
                />
                {/* Asset and Facility Management */}
                <Route
                  path="/assetfacility/createfacility"
                  element={
                    user ? <CreateNewFacilityPage /> : <Navigate to="/login" />
                  }
                />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </div>
    </PrimeReactProvider>
  );
}

export default App;
