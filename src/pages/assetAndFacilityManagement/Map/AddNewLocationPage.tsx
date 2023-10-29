import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { useNavigate } from "react-router-dom";
import AddNewLocationForm from "../../../components/AssetAndFacilityManagement/FacilityManagement/Map/AddNewLocationForm";

function AddNewLocationPage() {
  const navigate = useNavigate();

  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-10 text-black shadow-default">
        {/* Header */}
        <div className="mb-2 flex justify-between">
          <Button
            variant={"outline"}
            type="button"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <span className="self-center text-title-xl font-bold">
            Add New Location
          </span>
          <Button disabled className="invisible">
            Back
          </Button>
        </div>
        <Separator />
        {/*  */}
        <AddNewLocationForm />
      </div>
    </div>
  );
}

export default AddNewLocationPage;
