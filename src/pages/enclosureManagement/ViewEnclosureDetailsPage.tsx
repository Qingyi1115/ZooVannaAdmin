import React, { useState, useEffect } from "react";
import useApiJson from "../../hooks/useApiJson";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NavLink, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import Enclosure from "../../models/Enclosure";
import { useEnclosureContext } from "../../hooks/useEnclosureContext";

function ViewEnclosureDetailsPage() {
  const apiJson = useApiJson();
  const location = useLocation();
  const navigate = useNavigate();

  const { state, dispatch } = useEnclosureContext();

  const { enclosureId } = useParams<{ enclosureId: string }>();

  //   const [curEnclosure, setCurEnclosure] = useState<Enclosure | null>(null);
  const curEnclosure = state.curEnclosure;
  const [refreshSeed, setRefreshSeed] = useState<number>(0);

  // useEffect to fetch enclosure
  useEffect(() => {
    const fetchEnclosure = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/enclosure/getEnclosuresById/${enclosureId}`
        );
        // setCurEnclosure(responseJson as Enclosure);
        dispatch({ type: "SET_ENCLOSURE", payload: responseJson as Enclosure });
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchEnclosure();
  }, [refreshSeed, location.pathname]);

  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-lg">
        {/* header */}
        <div className="flex flex-col">
          <div className="mb-4 flex justify-between">
            <Button
              variant={"outline"}
              type="button"
              className=""
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
            <span className="self-center text-lg text-graydark">
              Enclosure Details
            </span>
            <Button disabled className="invisible">
              Back
            </Button>
          </div>
          <Separator />
          <span className="mt-4 self-center text-title-xl font-bold">
            {curEnclosure?.name}
          </span>
        </div>

        {/* Body */}
        <Button
          onClick={() =>
            navigate("/enclosure/viewenclosuredetails/enclosuredesigndiagram")
          }
        >
          View Design Diagram
        </Button>
      </div>
    </div>
  );
}

export default ViewEnclosureDetailsPage;
