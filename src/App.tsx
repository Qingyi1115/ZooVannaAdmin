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
import EditFacilityPage from "./pages/assetAndFacilityManagement/EditFacilityPage";
import ViewAllFacilitiesPage from "./pages/assetAndFacilityManagement/ViewAllFacilitiesPage";
import CreateNewAnimalFeedPage from "./pages/assetAndFacilityManagement/CreateNewAnimalFeedPage";
import CreateNewEnrichmentItemPage from "./pages/assetAndFacilityManagement/CreateNewEnrichmentItemPage";
import EditAnimalFeedPage from "./pages/assetAndFacilityManagement/EditAnimalFeedPage";
import EditEnrichmentItemPage from "./pages/assetAndFacilityManagement/EditEnrichmentItemPage";
import ViewAllAnimalFeedPage from "./pages/assetAndFacilityManagement/ViewAllAnimalFeedPage";
import ViewAllEnrichmentItemsPage from "./pages/assetAndFacilityManagement/ViewAllEnrichmentItemsPage";

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
                  path="/species/editspecies/:speciesCode"
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
                <Route
                  path="/assetfacility/editfacility"
                  element={
                    user ? <EditFacilityPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/assetfacility/viewallfacilities"
                  element={
                    user ? <ViewAllFacilitiesPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/assetfacility/createanimalfeed"
                  element={
                    user ? <CreateNewAnimalFeedPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/assetfacility/editanimalfeed"
                  element={
                    user ? <EditAnimalFeedPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/assetfacility/viewallfacilities"
                  element={
                    user ? <ViewAllAnimalFeedPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/assetfacility/createenrichmentitem"
                  element={
                    user ? <CreateNewEnrichmentItemPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/assetfacility/editenrichmentitem"
                  element={
                    user ? <EditEnrichmentItemPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/assetfacility/viewallenrichmentitems"
                  element={
                    user ? <ViewAllEnrichmentItemsPage /> : <Navigate to="/login" />
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
