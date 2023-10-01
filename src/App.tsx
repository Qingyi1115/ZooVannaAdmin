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
import EditSpeciesPage from "./pages/speciesManagement/EditSpeciesPage";
import NotFoundPage from "./pages/NotFoundPage";

import ViewSpeciesDetailsPage from "./pages/speciesManagement/ViewSpeciesDetailsPage";

//facility page
import CreateNewFacilityPage from "./pages/assetAndFacilityManagement/Facility/CreateNewFacilityPage";
import EditFacilityPage from "./pages/assetAndFacilityManagement/Facility/EditFacilityPage";
import ViewAllFacilitiesPage from "./pages/assetAndFacilityManagement/Facility/ViewAllFacilitiesPage";

//assets
import CreateNewAnimalFeedPage from "./pages/assetAndFacilityManagement/AnimalFeed/CreateNewAnimalFeedPage";
import CreateNewEnrichmentItemPage from "./pages/assetAndFacilityManagement/EnrichmentItem/CreateNewEnrichmentItemPage";
import EditAnimalFeedPage from "./pages/assetAndFacilityManagement/AnimalFeed/EditAnimalFeedPage";
import EditEnrichmentItemPage from "./pages/assetAndFacilityManagement/EnrichmentItem/EditEnrichmentItemPage";
import ViewAllAnimalFeedPage from "./pages/assetAndFacilityManagement/AnimalFeed/ViewAllAnimalFeedPage";
import ViewAllEnrichmentItemsPage from "./pages/assetAndFacilityManagement/EnrichmentItem/ViewAllEnrichmentItemsPage";
import CreateNewSensorPage from "./pages/assetAndFacilityManagement/Sensor/CreateNewSensorPage";
import EditSensorPage from "./pages/assetAndFacilityManagement/Sensor/EditSensorPage";
import ViewAllSensorsPage from "./pages/assetAndFacilityManagement/Sensor/ViewAllSensorsPage";

//customer account management page
import CreateNewCustomerPage from "./pages/customerAccountManagement/CreateNewCustomerPage";
import EditCustomerPage from "./pages/customerAccountManagement/EditCustomerPage";
import ViewAllCustomerPage from "./pages/customerAccountManagement/ViewAllCustomerPage";

//employee account management page
import ViewAllEmployeesPage from "./pages/employeeAccountManagement/ViewAllEmployeesPage";
import CreateNewEmployeePage from "./pages/employeeAccountManagement/CreateNewEmployeePage";
import CreateNewEnclosureRequirementsPage from "./pages/speciesManagement/CreateNewEnclosureRequirementsPage";
import EditEnclosureRequirementsPage from "./pages/speciesManagement/EditEnclosureRequirementsPage";
import ViewEmployeeDetailsPage from "./pages/employeeAccountManagement/ViewEmployeeDetailsPage";
import ProfilePage from "./pages/employeeCommonInfra/ProfilePage";
import EditPasswordPage from "./pages/employeeCommonInfra/EditPasswordPage";
import UpdateProfilePage from "./pages/employeeCommonInfra/UpdateProfilePage";
import CreateNewDietaryRequirementsPage from "./pages/speciesManagement/CreateNewDietaryRequirementsPage";
import EditDietaryRequirementsPage from "./pages/speciesManagement/EditDietaryRequirementsPage";
import MaintenanceOperationSuggestionPage from "./pages/assetAndFacilityManagement/MaintenanceOperations/MaintenanceOperationsPage";
import ViewFacilityDetailsPage from "./pages/assetAndFacilityManagement/Facility/ViewFacilityDetailsPage";
import RemoveMaintenanceStaffPage from "./pages/assetAndFacilityManagement/Facility/RemoveMaintenanceStaffPage";
import AssignMaintenanceStaffPage from "./pages/assetAndFacilityManagement/Facility/AssignMaintenanceStaffPage";
import CreateNewListingPage from "./pages/listingManagement/CreateNewListingPage";
import ViewAllListingsPage from "./pages/listingManagement/ViewAllListingsPage";

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
                  path="/species/viewspeciesdetails/:speciesCode"
                  element={
                    user ? <ViewSpeciesDetailsPage /> : <Navigate to="/login" />
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
                <Route
                  path="/species/createenclosurerequirements/:speciesCode"
                  element={
                    user ? (
                      <CreateNewEnclosureRequirementsPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/species/editenclosurerequirements/:speciesCode"
                  element={
                    user ? (
                      <EditEnclosureRequirementsPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/species/createdietaryrequirements/:speciesCode"
                  element={
                    user ? (
                      <CreateNewDietaryRequirementsPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/species/editdietaryrequirements/:speciesCode/:speciesDietNeedId"
                  element={
                    user ? (
                      <EditDietaryRequirementsPage />
                    ) : (
                      <Navigate to="/login" />
                    )
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
                  path="/assetfacility/viewfacilitydetails/:facilityId"
                  element={
                    user ? (
                      <ViewFacilityDetailsPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/assetfacility/editfacility/:facilityId"
                  element={
                    user ? <EditFacilityPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/assetfacility/editfacility/:facilityId/assignstaff"
                  element={
                    user ? (
                      <AssignMaintenanceStaffPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/assetfacility/editfacility/:facilityId/removestaff"
                  element={
                    user ? (
                      <RemoveMaintenanceStaffPage />
                    ) : (
                      <Navigate to="/login" />
                    )
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
                    user ? (
                      <CreateNewAnimalFeedPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/assetfacility/editanimalfeed/:animalFeedName"
                  element={
                    user ? <EditAnimalFeedPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/assetfacility/viewallanimalfeed"
                  element={
                    user ? <ViewAllAnimalFeedPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/assetfacility/createenrichmentitem"
                  element={
                    user ? (
                      <CreateNewEnrichmentItemPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/assetfacility/editenrichmentitem/:enrichmentItemId"
                  element={
                    user ? <EditEnrichmentItemPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/assetfacility/viewallenrichmentitems"
                  element={
                    user ? (
                      <ViewAllEnrichmentItemsPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/assetfacility/createsensor"
                  element={
                    user ? <CreateNewSensorPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/assetfacility/editsensor/:sensorName"
                  element={user ? <EditSensorPage /> : <Navigate to="/login" />}
                />
                <Route
                  path="/assetfacility/viewallsensors"
                  element={
                    user ? <ViewAllSensorsPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/assetfacility/maintenance"
                  element={
                    user ? (
                      <MaintenanceOperationSuggestionPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                {/*Employee Account Management */}
                <Route
                  path="/employeeAccount/viewEmployees"
                  element={
                    user ? <ViewAllEmployeesPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/employeeAccount/createNewEmployee"
                  element={
                    user ? <CreateNewEmployeePage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/employeeAccount/viewEmployeeDetails/:employeeId"
                  element={
                    user ? <ViewEmployeeDetailsPage /> : <Navigate to="login" />
                  }
                />

                {/* Customer Account Management */}
                <Route
                  path="/customer/viewallcustomers"
                  element={
                    user ? <ViewAllCustomerPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/customer/createnewcustomer"
                  element={
                    user ? <CreateNewCustomerPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/customer/editcustomer"
                  element={
                    user ? <EditCustomerPage /> : <Navigate to="/login" />
                  }
                />
                {/* Employee Account Management */}
                <Route
                  path="/employee/viewallemployees"
                  element={
                    user ? <ViewAllEmployeesPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/employee/createnewemployee"
                  element={
                    user ? <CreateNewEmployeePage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/profile"
                  element={user ? <ProfilePage /> : <Navigate to="/login" />}
                />
                <Route
                  path="/updateProfile"
                  element={
                    user ? <UpdateProfilePage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/edit-password"
                  element={
                    user ? <EditPasswordPage /> : <Navigate to="/login" />
                  }
                />
                {/* Listing Management */}
                <Route
                  path="/listing/createnewlisting"
                  element={
                    user ? <CreateNewListingPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/listing/viewalllistings"
                  element={
                    user ? <ViewAllListingsPage /> : <Navigate to="/login" />
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
