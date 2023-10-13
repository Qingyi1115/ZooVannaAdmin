import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChangeFacilityLocationForm from "../../../components/AssetAndFacilityManagement/FacilityManagement/Map/ChangeFacilityLocationForm";
import Facility from "../../../models/Facility";
import useApiJson from "../../../hooks/useApiJson";

function ChangeFacilityLocationPage() {
  const navigate = useNavigate();
  const apiJson = useApiJson();

  const { facilityId } = useParams<{ facilityId: string }>();

  const [curFacility, setCurFacility] = useState<Facility | null>(null);

  useEffect(() => {
    apiJson
      .post(
        `http://localhost:3000/api/assetFacility/getFacility/${facilityId}`,
        { includes: [] }
      )
      .then((res) => {
        setCurFacility(res["facility"]);
      });
  }, []);

  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-10 text-black shadow-default">
        {/* Header */}
        <div className="mb-4 flex justify-between">
          <Button
            variant={"outline"}
            type="button"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <span className="self-center text-lg text-graydark">
            Change Facility Location
          </span>
          <Button disabled className="invisible">
            Back
          </Button>
        </div>
        <Separator />
        <span className="mt-4 self-center text-title-xl font-bold">
          {curFacility && curFacility.facilityName}
        </span>
        {/*  */}
        {curFacility && (
          <ChangeFacilityLocationForm curFacility={curFacility} />
        )}
      </div>
    </div>
  );
}

export default ChangeFacilityLocationPage;
