import { useEffect, useState } from "react";
import { useParams } from "react-router";
import EditFacilityForm from "../../../components/AssetAndFacilityManagement/FacilityManagement/EditFacilityForm";
import useApiJson from "../../../hooks/useApiJson";
import Facility from "../../../models/Facility";

function EditFacilityPage() {
  const apiJson = useApiJson();

  const { facilityId } = useParams<{ facilityId: string }>();
  const { facilityDetail } = useParams<{ facilityDetail: string }>();
  const [refreshSeed, setRefreshSeed] = useState<number>(0);

  const facilityDetailJson =
    facilityDetail == "thirdParty"
      ? {
          ownership: "",
          ownerContact: "",
          maxAccommodationSize: "",
          hasAirCon: "",
          facilityType: "",
        }
      : {
          isPaid: "",
          maxAccommodationSize: "",
          hasAirCon: "",
          facilityType: "",
        };

  let emptyFacility: Facility = {
    facilityId: -1,
    facilityName: "",
    showOnMap: false,
    xCoordinate: 0,
    yCoordinate: 0,
    facilityDetail: "",
    facilityDetailJson: facilityDetailJson,
    isSheltered: false,
    hubProcessors: [],
  };

  const [curFacility, setCurFacility] = useState<Facility>(emptyFacility);

  useEffect(() => {
    apiJson
      .post(
        `http://localhost:3000/api/assetFacility/getFacility/${facilityId}`,
        { includes: [] }
      )
      .then((res) => {
        setCurFacility(res["facility"]);
      });
  }, [refreshSeed]);

  return (
    <div className="p-10">
      {curFacility && curFacility.facilityId != -1 && (
        <EditFacilityForm
          curFacility={curFacility}
          refreshSeed={refreshSeed}
          setRefreshSeed={setRefreshSeed}
        />
      )}
    </div>
  );
}

export default EditFacilityPage;
