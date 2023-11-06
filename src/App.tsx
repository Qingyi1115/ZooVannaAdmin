import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

import { PrimeReactProvider } from "primereact/api";
// import "@fullcalendar/daygrid/main.css";

import MainLayout from "./components/MainLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

import NotFoundPage from "./pages/NotFoundPage";

// Species
import CreateNewDietaryRequirementsPage from "./pages/speciesManagement/CreateNewDietaryRequirementsPage";
import CreateNewSpeciesPage from "./pages/speciesManagement/CreateNewSpeciesPage";
import EditDietaryRequirementsPage from "./pages/speciesManagement/EditDietaryRequirementsPage";
import EditSpeciesPage from "./pages/speciesManagement/EditSpeciesPage";
import ViewAllSpeciesPage from "./pages/speciesManagement/ViewAllSpeciesPage";
import ViewSpeciesDetailsPage from "./pages/speciesManagement/ViewSpeciesDetailsPage";

import CreatePhysiologicalRefNormPage from "./pages/speciesManagement/CreatePhysiologicalRefNormPage";
import EditEducationalContentPage from "./pages/speciesManagement/EditEducationalContentPage";
import EditPhysioRefNormPage from "./pages/speciesManagement/EditPhysioRefNormPage";

// Animal
import AddAnimalToActivityPage from "./pages/animalManagement/AddAnimalToActivityPage";
import AddItemToActivityPage from "./pages/animalManagement/AddItemToActivityPage";
import AnimalActivityHomePage from "./pages/animalManagement/AnimalActivityHomePage";
import AnimalFeedingPlanDetailsPage from "./pages/animalManagement/AnimalFeedingPlanDetailsPage";
import AnimalFeedingPlanHomePage from "./pages/animalManagement/AnimalFeedingPlanHomePage";
import CheckIsInbreedingPage from "./pages/animalManagement/CheckIsInbreedingPage";
import CreateAnimalActivityPage from "./pages/animalManagement/CreateAnimalActivityPage";
import CreateFeedingPlan from "./pages/animalManagement/CreateFeedingPlan";
import CreateNewAnimalActivityLogPage from "./pages/animalManagement/CreateNewAnimalActivityLogPage";
import CreateNewAnimalFeedingLogPage from "./pages/animalManagement/CreateNewAnimalFeedingLogPage";
import CreateNewAnimalObservationLogPage from "./pages/animalManagement/CreateNewAnimalObservationLogPage";
import CreateNewAnimalPage from "./pages/animalManagement/CreateNewAnimalPage";
import CreateNewWeightRecord from "./pages/animalManagement/CreateNewWeightRecord";
import DeclareDeathPage from "./pages/animalManagement/DeclareDeathPage";
import EditAnimalActivityLogPage from "./pages/animalManagement/EditAnimalActivityLogPage";
import EditAnimalActivityPage from "./pages/animalManagement/EditAnimalActivityPage";
import EditAnimalFeedingLogPage from "./pages/animalManagement/EditAnimalFeedingLogPage";
import EditAnimalObservationLogPage from "./pages/animalManagement/EditAnimalObservationLogPage";
import EditAnimalPage from "./pages/animalManagement/EditAnimalPage";
import EditFeedingPlanBasicInfoPage from "./pages/animalManagement/EditFeedingPlanBasicInfoPage";
import ViewAllAnimalsPage from "./pages/animalManagement/ViewAllAnimalsPage";
import ViewAnimalActivityDetails from "./pages/animalManagement/ViewAnimalActivityDetails";
import ViewAnimalActivityLogDetailsPage from "./pages/animalManagement/ViewAnimalActivityLogDetailsPage";
import ViewAnimalDetailsPage from "./pages/animalManagement/ViewAnimalDetailsPage";
import ViewAnimalFeedingLogDetailsPage from "./pages/animalManagement/ViewAnimalFeedingLogDetailsPage";
import ViewAnimalFullLineage from "./pages/animalManagement/ViewAnimalFullLineage";
import ViewAnimalObservationLogDetailsPage from "./pages/animalManagement/ViewAnimalObservationLogDetailsPage";
import ViewPopulationDetailsPage from "./pages/animalManagement/ViewPopulationDetailsPage";

//facility page
import CreateNewFacilityPage from "./pages/assetAndFacilityManagement/Facility/CreateNewFacilityPage";
import EditFacilityPage from "./pages/assetAndFacilityManagement/Facility/EditFacilityPage";
import CreateNewFacilityLogPage from "./pages/assetAndFacilityManagement/Facility/FacilityLog/CreateNewFacilityLogPage";
import EditFacilityLogPage from "./pages/assetAndFacilityManagement/Facility/FacilityLog/EditFacilityLogPage";
import ViewFacilityLogDetailsPage from "./pages/assetAndFacilityManagement/Facility/FacilityLog/ViewFacilityLogDetailsPage";
import ViewAllFacilitiesPage from "./pages/assetAndFacilityManagement/Facility/ViewAllFacilitiesPage";

//assets
import CreateNewHubForm from "./components/AssetAndFacilityManagement/AssetManagement/Hub/CreateNewHubForm";
import CreateNewSensorForm from "./components/AssetAndFacilityManagement/AssetManagement/Sensor/CreateNewSensorForm";
import CreateNewAnimalFeedPage from "./pages/assetAndFacilityManagement/AnimalFeed/CreateNewAnimalFeedPage";
import EditAnimalFeedPage from "./pages/assetAndFacilityManagement/AnimalFeed/EditAnimalFeedPage";
import CreateNewEnrichmentItemPage from "./pages/assetAndFacilityManagement/EnrichmentItem/CreateNewEnrichmentItemPage";
import EditEnrichmentItemPage from "./pages/assetAndFacilityManagement/EnrichmentItem/EditEnrichmentItemPage";
import ViewAllEnrichmentItemsPage from "./pages/assetAndFacilityManagement/EnrichmentItem/ViewAllEnrichmentItemsPage";
import ViewFacilityDetailsPage from "./pages/assetAndFacilityManagement/Facility/ViewFacilityDetailsPage";
import EditHubPage from "./pages/assetAndFacilityManagement/Hub/EditHubPage";
import ViewAllHubsPage from "./pages/assetAndFacilityManagement/Hub/ViewAllHubsPage";
import ViewHubDetailsPage from "./pages/assetAndFacilityManagement/Hub/ViewHubDetailsPage";
import MaintenanceOperationSuggestionPage from "./pages/assetAndFacilityManagement/MaintenanceOperations/MaintenanceOperationsPage";
import AddNewLocationPage from "./pages/assetAndFacilityManagement/Map/AddNewLocationPage";
import ChangeFacilityLocationPage from "./pages/assetAndFacilityManagement/Map/ChangeFacilityLocationPage";
import MapLandingPage from "./pages/assetAndFacilityManagement/Map/MapLandingPage";
import EditSensorPage from "./pages/assetAndFacilityManagement/Sensor/EditSensorPage";
import CreateNewSensorMaintenanceLogPage from "./pages/assetAndFacilityManagement/Sensor/MaintenanceLog/CreateSensorNewMaintenanceLogPage";
import EditMaintenanceLogPage from "./pages/assetAndFacilityManagement/Sensor/MaintenanceLog/EditMaintenanceLogPage";
import ViewMaintenanceLogDetailsPage from "./pages/assetAndFacilityManagement/Sensor/MaintenanceLog/ViewMaintenanceLogDetailsPage";
import ViewSensorDetailsPage from "./pages/assetAndFacilityManagement/Sensor/ViewSensorDetailsPage";

//customer account management page
import CreateNewCustomerPage from "./pages/customerAccountManagement/CreateNewCustomerPage";
import EditCustomerPage from "./pages/customerAccountManagement/EditCustomerPage";
import ViewAllCustomerPage from "./pages/customerAccountManagement/ViewAllCustomerPage";

//employee account management page
import CreateNewEmployeePage from "./pages/employeeAccountManagement/CreateNewEmployeePage";
import ViewAllEmployeesPage from "./pages/employeeAccountManagement/ViewAllEmployeesPage";
import ViewEmployeeDetailsPage from "./pages/employeeAccountManagement/ViewEmployeeDetailsPage";
import EditPasswordPage from "./pages/employeeCommonInfra/EditPasswordPage";
import ProfilePage from "./pages/employeeCommonInfra/ProfilePage";
import UpdateProfilePage from "./pages/employeeCommonInfra/UpdateProfilePage";
import CreateNewEnclosureRequirementsPage from "./pages/speciesManagement/CreateNewEnclosureRequirementsPage";
import EditEnclosureRequirementsPage from "./pages/speciesManagement/EditEnclosureRequirementsPage";
//import AssignMaintenanceStaffPage from "./pages/assetAndFacilityManagement/Facility/AssignMaintenanceStaffPage";
import CreateNewFacilityMaintenanceLogPage from "./pages/assetAndFacilityManagement/Facility/FacilityLog/CreateNewFacilityMaintenanceLogPage";
import FacilityMaintenanceChartPage from "./pages/assetAndFacilityManagement/MaintenanceOperations/FacilityMaintenanceChartPage";
import ManageFacilityMaintenanceStaffPage from "./pages/assetAndFacilityManagement/MaintenanceOperations/ManageFacilityMaintenanceStaffPage";
import SensorMaintenanceChartPage from "./pages/assetAndFacilityManagement/MaintenanceOperations/SensorMaintenanceChartPage";
import ViewAllAssetsPage from "./pages/assetAndFacilityManagement/ViewAllAssetsPage";
import CreateNewListingPage from "./pages/listingManagement/CreateNewListingPage";
import EditListingPage from "./pages/listingManagement/EditListingPage";
import ViewAllListingsPage from "./pages/listingManagement/ViewAllListingsPage";
import ViewListingDetailsPage from "./pages/listingManagement/ViewListingDetailsPage";

//promotion management page
import ViewCameraFeedsPage from "./pages/assetAndFacilityManagement/Sensor/ViewCameraFeedsPage";
import ViewCameraPage from "./pages/assetAndFacilityManagement/Sensor/ViewCameraPage";
import ResetPasswordPage from "./pages/employeeCommonInfra/ResetPasswordPage";
import CreateNewPromotionPage from "./pages/promotion/CreateNewPromotionPage";
import EditPromotionPage from "./pages/promotion/EditPromotionPage";
import ViewAllPromotionsPage from "./pages/promotion/ViewAllPromotionsPage";
import ViewPromotionDetailsPage from "./pages/promotion/ViewPromotionDetailsPage";

//customer order management page
import ViewAllCustomerOrdersPage from "./pages/customerOrder/ViewAllCustomerOrdersPage";
import ViewCustomerOrderDetailsPage from "./pages/customerOrder/ViewCustomerOrderDetailsPage";
import SalesChartPage from "./pages/sales/SalesChartPage";

//Event management page
import CreateLeaveEventPage from "./pages/eventManagement/CreateLeaveEventPage";
import CreatePublicZooEventPage from "./pages/eventManagement/CreatePublicZooEventPage";
import EditZooEventPage from "./pages/eventManagement/EditZooEventPage";
import ViewZooEventDetails from "./pages/eventManagement/ViewZooEventDetails";
import ZooEventHomePage from "./pages/eventManagement/ZooEventHomePage";

//announcement
import CreateNewAnnouncementPage from "./pages/announcement/CreateNewAnnouncementPage";
import EditAnnouncementPage from "./pages/announcement/EditAnnouncementPage";
import ViewAllAnnouncementsPage from "./pages/announcement/ViewAllAnnouncementsPage";
import ViewAnnouncementDetailsPage from "./pages/announcement/ViewAnnouncementDetailsPage";

function App() {
  const { state } = useAuthContext();
  const { user } = state;
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  console.log(user);

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
                  path="/animal/editanimal/:animalCode/"
                  element={user ? <EditAnimalPage /> : <Navigate to="/login" />}
                />
                <Route
                  path="/animal/viewallanimals"
                  element={
                    user ? <ViewAllAnimalsPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/animal/viewanimaldetails/:animalCode/:tab"
                  element={
                    user ? <ViewAnimalDetailsPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/animal/viewanimaldetails/:animalCode/"
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
                <Route
                  path="/animal/createweightrecord/:animalCode"
                  element={
                    user ? <CreateNewWeightRecord /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/animal/viewfulllineage/:animalCode"
                  element={
                    user ? <ViewAnimalFullLineage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/animal/createAnimalObservationLog/:animalActivityId"
                  element={
                    user ? (
                      <CreateNewAnimalObservationLogPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/animal/viewAnimalObservationLogDetails/:animalObservationLogId"
                  element={
                    user ? (
                      <ViewAnimalObservationLogDetailsPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/animal/editAnimalObservationLog/:animalObservationLogId"
                  element={
                    user ? (
                      <EditAnimalObservationLogPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/animal/createAnimalActivityLog/:animalActivityId"
                  element={
                    user ? (
                      <CreateNewAnimalActivityLogPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/animal/viewAnimalActivityLogDetails/:animalActivityLogId"
                  element={
                    user ? (
                      <ViewAnimalActivityLogDetailsPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/animal/editAnimalActivityLog/:animalActivityLogId"
                  element={
                    user ? (
                      <EditAnimalActivityLogPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/animal/createAnimalFeedingLog/:feedingPlanId"
                  element={
                    user ? (
                      <CreateNewAnimalFeedingLogPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/animal/viewAnimalFeedingLogDetails/:animalFeedingLogId"
                  element={
                    user ? (
                      <ViewAnimalFeedingLogDetailsPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/animal/editAnimalFeedingLog/:animalFeedingLogId"
                  element={
                    user ? (
                      <EditAnimalFeedingLogPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/animal/animalactivities"
                  element={
                    user ? <AnimalActivityHomePage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/animal/createanimalactivity/"
                  element={
                    user ? (
                      <CreateAnimalActivityPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/animal/editanimalactivity/:animalActivityId"
                  element={
                    user ? <EditAnimalActivityPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/animal/viewanimalactivitydetails/:animalActivityId"
                  element={
                    user ? (
                      <ViewAnimalActivityDetails />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/animal/viewanimalactivitydetails/:animalActivityId/:tab"
                  element={
                    user ? (
                      <ViewAnimalActivityDetails />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/animal/assignanimalstoactivity/:animalActivityId"
                  element={
                    user ? (
                      <AddAnimalToActivityPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/animal/assignitemstoactivity/:animalActivityId"
                  element={
                    user ? <AddItemToActivityPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/animal/declaredeath/:animalCode"
                  element={
                    user ? <DeclareDeathPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/animal/checkisinbreeding/:speciesCode"
                  element={
                    user ? <CheckIsInbreedingPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/animal/feedingplanhome/:speciesCode"
                  element={
                    user ? (
                      <AnimalFeedingPlanHomePage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/animal/createfeedingplan/:speciesCode"
                  element={
                    user ? <CreateFeedingPlan /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/animal/viewfeedingplandetails/:feedingPlanId"
                  element={
                    user ? (
                      <AnimalFeedingPlanDetailsPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/animal/viewfeedingplandetails/:feedingPlanId/"
                  element={
                    user ? (
                      <AnimalFeedingPlanDetailsPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/animal/viewfeedingplandetails/:feedingPlanId/:tab"
                  element={
                    user ? (
                      <AnimalFeedingPlanDetailsPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/animal/editfeedingplanbasicinfo/:feedingPlanId"
                  element={
                    user ? (
                      <EditFeedingPlanBasicInfoPage />
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
                  path="/assetfacility/viewallassets/:tab"
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
                  path="/assetfacility/editanimalfeed/:animalFeedId"
                  element={
                    user ? <EditAnimalFeedPage /> : <Navigate to="/login" />
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
                  path="/assetfacility/viewcamera/:sensorId"
                  element={user ? <ViewCameraPage /> : <Navigate to="/login" />}
                />

                <Route
                  path="/assetfacility/viewcamerafeeds/:sensorId"
                  element={user ? <ViewCameraFeedsPage /> : <Navigate to="/login" />}
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
                  path="/assetfacility/createsensormaintenancelog/:sensorId"
                  element={
                    user ? (
                      <CreateNewSensorMaintenanceLogPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/assetfacility/editmaintenancelog/:maintenanceLogId"
                  element={
                    user ? <EditMaintenanceLogPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/assetfacility/viewmaintenancelogdetails/:maintenanceLogId"
                  element={
                    user ? (
                      <ViewMaintenanceLogDetailsPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                {/* <Route
                  path="/assetfacility/createfacilitylog/:facilityId"
                  element={
                    user ? (
                      <CreateNewFacilityLogPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                /> */}
                <Route
                  path="/assetfacility/createfacilitylog/:facilityId/:facilityLogType"
                  element={
                    user ? (
                      <CreateNewFacilityLogPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/assetfacility/editfacilitylog/:facilityLogId"
                  element={
                    user ? <EditFacilityLogPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/assetfacility/completeFacilityRepair/:facilityLogId"
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
                <Route
                  path="/assetfacility/maplanding/"
                  element={user ? <MapLandingPage /> : <Navigate to="/login" />}
                />
                <Route
                  path="/assetfacility/addlocation/"
                  element={
                    user ? <AddNewLocationPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/assetfacility/changelocation/:facilityId"
                  element={
                    user ? (
                      <ChangeFacilityLocationPage />
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
                    user ? (
                      <ViewEmployeeDetailsPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="employeeAccount/setPassword/:token"
                  element={<ResetPasswordPage />}
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
                {/* Employee Account Management
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
                />*/}
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
                  path="/customerOrder/viewAllCustomerOrders"
                  element={
                    user ? (
                      <ViewAllCustomerOrdersPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />

                <Route
                  path="/customerOrder/viewCustomerOrder/:customerOrderId"
                  element={
                    user ? (
                      <ViewCustomerOrderDetailsPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />

                <Route
                  path="/sales/viewGraph/"
                  element={user ? <SalesChartPage /> : <Navigate to="/login" />}
                />

                <Route
                  path="/promotion/editpromotion/:promotionId"
                  element={
                    user ? <EditPromotionPage /> : <Navigate to="/login" />
                  }
                />

                <Route
                  path="/announcement/createnewannouncement"
                  element={
                    user ? (
                      <CreateNewAnnouncementPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />

                <Route
                  path="/announcement/viewallannouncements"
                  element={
                    user ? (
                      <ViewAllAnnouncementsPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/announcement/viewannouncement/:announcementId"
                  element={
                    user ? (
                      <ViewAnnouncementDetailsPage />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/announcement/editannouncement/:announcementId"
                  element={
                    user ? <EditAnnouncementPage /> : <Navigate to="/login" />
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
                {/* Event Management */}
                <Route
                  path="/zooevent/createleaveevent/:employeeId"
                  element={
                    user ? <CreateLeaveEventPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/zooevent/createpubliczooevent"
                  element={
                    user ? <CreatePublicZooEventPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/zooevent/viewallzooevents"
                  element={
                    user ? <ZooEventHomePage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/zooevent/editzooevent/:zooEventId"
                  element={
                    user ? <EditZooEventPage /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/zooevent/viewzooeventdetails/:zooEventId"
                  element={
                    user ? <ViewZooEventDetails /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/zooevent/viewzooeventdetails/:zooEventId/:tab"
                  element={
                    user ? <ViewZooEventDetails /> : <Navigate to="/login" />
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
