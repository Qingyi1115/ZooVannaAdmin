import { useEffect, useState } from "react";
import useApiJson from "../../hooks/useApiJson";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEnclosureContext } from "../../hooks/useEnclosureContext";
import Enclosure from "../../models/Enclosure";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnclosureAnimalList from "../../components/EnclosureManagement/ViewEnclosureDetailsPage/EnclosureAnimalList";
import EnclosureBasicInformation from "../../components/EnclosureManagement/ViewEnclosureDetailsPage/EnclosureBasicInformation";
import EnclosureEnrichmentItemList from "../../components/EnclosureManagement/ViewEnclosureDetailsPage/EnclosureEnrichmentItemList";
import EnclosureLayoutDesign from "../../components/EnclosureManagement/ViewEnclosureDetailsPage/EnclosureLayoutDesign";
import EnclosureEnvironment from "../../components/EnclosureManagement/ViewEnclosureDetailsPage/EnclosureEnvironment";

function ViewEnclosureDetailsPage() {
  const apiJson = useApiJson();
  const location = useLocation();
  const navigate = useNavigate();

  const { state, dispatch } = useEnclosureContext();

  const { enclosureId } = useParams<{ enclosureId: string }>();
  const { tab } = useParams<{ tab: string }>();

  //   const [curEnclosure, setCurEnclosure] = useState<Enclosure | null>(null);
  const curEnclosure = state.curEnclosure;
  const [refreshSeed, setRefreshSeed] = useState<number>(0);

  // useEffect to fetch enclosure
  useEffect(() => {
    const fetchEnclosure = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/enclosure/getEnclosureById/${enclosureId}`
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

        <Tabs defaultValue={tab ? `${tab}` : "basicinfo"} className="w-full">
          <TabsList className="no-scrollbar mb-4 w-full justify-around overflow-x-auto px-4 text-xs xl:text-base">
            <span className="invisible">_____</span>
            <TabsTrigger value="basicinfo">Basic Information</TabsTrigger>
            <TabsTrigger value="layoutdesign">Layout & Design</TabsTrigger>
            <TabsTrigger value="animalslist">Animals List</TabsTrigger>
            <TabsTrigger value="environment">Environment</TabsTrigger>
            <TabsTrigger value="safety">Safety</TabsTrigger>
            <TabsTrigger value="enrichmentitems">Enrichment Items</TabsTrigger>
            {/* <TabsTrigger value="medical">Medical</TabsTrigger> */}
          </TabsList>
          <TabsContent value="basicinfo">
            {curEnclosure && (
              <EnclosureBasicInformation curEnclosure={curEnclosure} />
            )}
          </TabsContent>
          <TabsContent value="layoutdesign">
            {curEnclosure && (
              <EnclosureLayoutDesign curEnclosure={curEnclosure} />
            )}
          </TabsContent>
          <TabsContent value="animalslist">
            {curEnclosure && (
              <EnclosureAnimalList curEnclosure={curEnclosure} />
            )}
          </TabsContent>
          <TabsContent value="environment">
            {curEnclosure && (
              <EnclosureEnvironment curEnclosure={curEnclosure} />
            )}
          </TabsContent>
          <TabsContent value="safety">
            <div>test</div>
          </TabsContent>
          <TabsContent value="enrichmentitems">
            {curEnclosure && (
              <EnclosureEnrichmentItemList curEnclosure={curEnclosure} />
            )}
          </TabsContent>
          {/* <TabsContent value="medical">
              Medical Logs and whatever else here
            </TabsContent> */}
        </Tabs>
      </div>
    </div>
  );
}

export default ViewEnclosureDetailsPage;
