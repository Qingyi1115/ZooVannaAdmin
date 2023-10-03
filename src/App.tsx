import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import { useState } from "react";

import { PrimeReactProvider } from "primereact/api";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MainLayout from "./components/MainLayout";

import NotFoundPage from "./pages/NotFoundPage";

// Species
import ViewAllSpeciesPage from "./pages/speciesManagement/ViewAllSpeciesPage";
import CreateNewSpeciesPage from "./pages/speciesManagement/CreateNewSpeciesPage";
import EditSpeciesPage from "./pages/speciesManagement/EditSpeciesPage";
import ViewSpeciesDetailsPage from "./pages/speciesManagement/ViewSpeciesDetailsPage";
import CreateNewDietaryRequirementsPage from "./pages/speciesManagement/CreateNewDietaryRequirementsPage";
import EditDietaryRequirementsPage from "./pages/speciesManagement/EditDietaryRequirementsPage";

import EditEducationalContentPage from "./pages/speciesManagement/EditEducationalContentPage";
import CreatePhysiologicalRefNormPage from "./pages/speciesManagement/CreatePhysiologicalRefNormPage";
import EditPhysioRefNormPage from "./pages/speciesManagement/EditPhysioRefNormPage";

// Animal
import CreateNewAnimalPage from "./pages/animalManagement/CreateNewAnimalPage";
import ViewAllAnimalsPage from "./pages/animalManagement/ViewAllAnimalsPage";
import ViewAnimalDetailsPage from "./pages/animalManagement/ViewAnimalDetailsPage";
import ViewPopulationDetailsPage from "./pages/animalManagement/ViewPopulationDetailsPage";

//facility page
import CreateNewFacilityPage from "./pages/assetAndFacilityManagement/Facility/CreateNewFacilityPage";
import EditFacilityPage from "./pages/assetAndFacilityManagement/Facility/EditFacilityPage";
import ViewAllFacilitiesPage from "./pages/assetAndFacilityManagement/Facility/ViewAllFacilitiesPage";
import ViewFacilityLogDetailsPage from "./pages/assetAndFacilityManagement/Facility/FacilityLog/ViewFacilityLogDetailsPage";
import CreateNewFacilityLogPage from "./pages/assetAndFacilityManagement/Facility/FacilityLog/CreateNewFacilityLogPage";
import EditFacilityLogPage from "./pages/assetAndFacilityManagement/Facility/FacilityLog/EditFacilityLogPage";

//assets
import CreateNewAnimalFeedPage from "./pages/assetAndFacilityManagement/AnimalFeed/CreateNewAnimalFeedPage";
import CreateNewEnrichmentItemPage from "./pages/assetAndFacilityManagement/EnrichmentItem/CreateNewEnrichmentItemPage";
import EditAnimalFeedPage from "./pages/assetAndFacilityManagement/AnimalFeed/EditAnimalFeedPage";
import EditEnrichmentItemPage from "./pages/assetAndFacilityManagement/EnrichmentItem/EditEnrichmentItemPage";
import ViewAllAnimalFeedPage from "./pages/assetAndFacilityManagement/AnimalFeed/ViewAllAnimalFeedPage";
import ViewAllEnrichmentItemsPage from "./pages/assetAndFacilityManagement/EnrichmentItem/ViewAllEnrichmentItemsPage";
import EditSensorPage from "./pages/assetAndFacilityManagement/Sensor/EditSensorPage";
import EditHubPage from "./pages/assetAndFacilityManagement/Hub/EditHubPage";
import ViewAllHubsPage from "./pages/assetAndFacilityManagement/Hub/ViewAllHubsPage";
import ViewHubDetailsPage from "./pages/assetAndFacilityManagement/Hub/ViewHubDetailsPage";
import ViewSensorDetailsPage from "./pages/assetAndFacilityManagement/Sensor/ViewSensorDetailsPage";
import CreateNewHubForm from "./components/AssetAndFacilityManagement/AssetManagement/Hub/CreateNewHubForm";
import CreateNewSensorForm from "./components/AssetAndFacilityManagement/AssetManagement/Sensor/CreateNewSensorForm";
import CreateNewMaintenanceLogPage from "./pages/assetAndFacilityManagement/Sensor/MaintenanceLog/CreateNewMaintenanceLogPage";
import EditMaintenanceLogPage from "./pages/assetAndFacilityManagement/Sensor/MaintenanceLog/EditMaintenanceLogPage";
import ViewMaintenanceLogDetailsPage from "./pages/assetAndFacilityManagement/Sensor/MaintenanceLog/ViewMaintenanceLogDetailsPage";
import MaintenanceOperationSuggestionPage from "./pages/assetAndFacilityManagement/MaintenanceOperations/MaintenanceOperationsPage";
import ViewFacilityDetailsPage from "./pages/assetAndFacilityManagement/Facility/ViewFacilityDetailsPage";

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
//import AssignMaintenanceStaffPage from "./pages/assetAndFacilityManagement/Facility/AssignMaintenanceStaffPage";
import CreateNewListingPage from "./pages/listingManagement/CreateNewListingPage";
import ViewAllListingsPage from "./pages/listingManagement/ViewAllListingsPage";
import EditListingPage from "./pages/listingManagement/EditListingPage";
import ViewListingDetailsPage from "./pages/listingManagement/ViewListingDetailsPage";
import RemoveMaintenanceStaffPage from "./pages/assetAndFacilityManagement/MaintenanceOperations/ManageOperationStaffPage";
import ManageFacilityMaintenanceStaffPage from "./pages/assetAndFacilityManagement/MaintenanceOperations/ManageFacilityMaintenanceStaffPage";
import SensorMaintenanceChartPage from "./pages/assetAndFacilityManagement/MaintenanceOperations/SensorMaintenanceChartPage";
import FacilityMaintenanceChartPage from "./pages/assetAndFacilityManagement/MaintenanceOperations/FacilityMaintenanceChartPage";
import CreateNewFacilityMaintenanceLogPage from "./pages/assetAndFacilityManagement/Facility/FacilityLog/CreateNewFacilityMaintenanceLogPage";
import EditEmployeePage from "./pages/employeeAccountManagement/EditEmployeePage";
import ViewAllAssetsPage from "./pages/assetAndFacilityManagement/ViewAllAssetsPage";

//promotion management page
import CreateNewPromotionPage from "./pages/promotion/CreateNewPromotionPage";
import ViewAllPromotionsPage from "./pages/promotion/ViewAllPromotionsPage";
import ViewPromotionDetailsPage from "./pages/promotion/ViewPromotionDetailsPage";
import EditPromotionPage from "./pages/promotion/EditPromotionPage";

function App() {
  const { state } = useAuthContext();
  const { user } = state;
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  return (
    <PrimeReactProvider>
      <div className="App bg-whiter font-inter">
        <BrowserRouter>
          <MainLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
            <Routes>
              <Route
                path="/login"
                element={!user ? <LoginPage /> : <Navigate to={"/"} />}
              />
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
                  path="/species/viewspeciesdetails/:speciesCode/:tab"
                  element={
                    user ? <ViewSpeciesDetailsPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/species/viewspeciesdetails/:speciesCode/"
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
                <Route
                  path="/species/editeducontent/:speciesCode/"
                  element={
                    user ? (
                      <EditEducationalContentPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/species/createphysioref/:speciesCode/"
                  element={
                    user ? (
                      <CreatePhysiologicalRefNormPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/species/editphysiorefnorm/:speciesCode/:physiologicalRefId"
                  element={
                    user ? <EditPhysioRefNormPage /> : <Navigate to="/login" />
                  }
                />
                {/* Animal Management */}
                <Route
                  path="/animal/createanimal"
                  element={
                    user ? <CreateNewAnimalPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/animal/viewallanimals"
                  element={
                    user ? <ViewAllAnimalsPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/animal/viewanimaldetails/:animalCode"
                  element={
                    user ? <ViewAnimalDetailsPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/animal/viewpopulationdetails/:speciesCode"
                  element={
                    user ? (
                      <ViewPopulationDetailsPage />
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
                  path="/assetfacility/viewfacilitydetails/:facilityId/:tab"
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
                  path="/assetfacility/editfacility/:facilityId/managestaff"
                  element={
                    user ? (
                      <ManageFacilityMaintenanceStaffPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />

                <Route
                  path="/assetfacility/viewSensorMaintenanceChart/:sensorId"
                  element={
                    user ? (
                      <SensorMaintenanceChartPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/assetfacility/viewFacilityMaintenanceChart/:facilityId"
                  element={
                    user ? (
                      <FacilityMaintenanceChartPage />
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
                  path="/assetfacility/viewallassets"
                  element={
                    user ? <ViewAllAssetsPage /> : <Navigate to="/login" />
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
                {/*<Route
                  path="/assetfacility/createsensor"
                  element={
                    user ? <CreateNewSensorPage /> : <Navigate to="/login" />
                  }
                />*/}

                <Route
                  path="/assetfacility/createsensor/:hubProcessorId"
                  element={
                    user ? <CreateNewSensorForm /> : <Navigate to="/login" />
                  }
                />

                {/* <Route
                  path="/assetfacility/viewallsensors"
                  element={
                    user ? <ViewAllSensorsPage /> : <Navigate to="/login" />
                  }
                /> */}
                <Route
                  path="/assetfacility/editsensor/:sensorId"
                  element={user ? <EditSensorPage /> : <Navigate to="/login" />}
                />

                <Route
                  path="/assetfacility/viewsensordetails/:sensorId"
                  element={
                    user ? <ViewSensorDetailsPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/assetfacility/viewsensordetails/:sensorId/:tab"
                  element={
                    user ? <ViewSensorDetailsPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/assetfacility/createhub"
                  element={
                    user ? <CreateNewHubForm /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/assetfacility/createhub/:facilityId"
                  element={
                    user ? <CreateNewHubForm /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/assetfacility/edithub/:hubProcessorId"
                  element={user ? <EditHubPage /> : <Navigate to="/login" />}
                />
                <Route
                  path="/assetfacility/viewallhubs/:facilityId"
                  element={
                    user ? <ViewAllHubsPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/assetfacility/viewallhubs/"
                  element={
                    user ? <ViewAllHubsPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/assetfacility/viewhubdetails/:hubProcessorId"
                  element={
                    user ? <ViewHubDetailsPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/assetfacility/viewhubdetails/:hubProcessorId/:tab"
                  element={
                    user ? <ViewHubDetailsPage /> : <Navigate to="/login" />
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
                <Route
                  path="/assetfacility/maintenance/:tab"
                  element={
                    user ? (
                      <MaintenanceOperationSuggestionPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/assetfacility/createmaintenancelog/:sensorId"
                  element={
                    user ? (
                      <CreateNewMaintenanceLogPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/assetfacility/editmaintenancelog/:logId"
                  element={
                    user ? <EditMaintenanceLogPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/assetfacility/viewmaintenancelogdetails/:logId"
                  element={
                    user ? (
                      <ViewMaintenanceLogDetailsPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/assetfacility/createfacilitylog/:facilityId"
                  element={
                    user ? (
                      <CreateNewFacilityLogPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/assetfacility/completefacilitymaintenance/:facilityId"
                  element={
                    user ? (
                      <CreateNewFacilityMaintenanceLogPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/assetfacility/editfacilitylog/:logId"
                  element={
                    user ? <EditFacilityLogPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/assetfacility/viewfacilitylogdetails/:logId"
                  element={
                    user ? (
                      <ViewFacilityLogDetailsPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                {/* <Route
                  path="/assetfacility/viewallcustomerreports"
                  element={
                    user ? (
                      <ViewAllCustomerReportsPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                /> */}
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
                    user ? (
                      <ViewEmployeeDetailsPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                {/* <Route
                  path="/employeeAccount/editemployee"
                  element={
                    user ? <EditEmployeePage /> : <Navigate to="/login" />

                  }
                /> */}

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
                {/* <Route
                  path="/employee/editemployee"
                  element={
                    user ? <EditEmployeePage /> : <Navigate to="/login" />
                  }
                /> */}
                <Route
                  path="/promotion/createnewpromotion"
                  element={
                    user ? <CreateNewPromotionPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/promotion/viewallpromotions"
                  element={
                    user ? <ViewAllPromotionsPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/promotion/viewpromotion/:promotionId"
                  element={
                    user ? (
                      <ViewPromotionDetailsPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/promotion/editpromotion/:promotionId"
                  element={
                    user ? <EditPromotionPage /> : <Navigate to="/login" />
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
                <Route
                  path="/listing/editlisting/:listingId"
                  element={
                    user ? <EditListingPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/listing/viewlisting/:listingId"
                  element={
                    user ? <ViewListingDetailsPage /> : <Navigate to="/login" />
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
