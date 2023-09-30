import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useApiJson from "../../../hooks/useApiJson";
import Hub from "../../../models/Hub";
import { Button } from "@/components/ui/button";
import { HubStatus } from "../../../enums/HubStatus";
import ViewHubDetails from "../../../components/AssetAndFacilityManagement/AssetManagement/Hub/ViewHubDetails";
import Facility from "../../../models/Facility";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AllSensorDatatable from "../../../components/AssetAndFacilityManagement/AssetManagement/Sensor/AllSensorDatatable";


function ViewHubDetailsPage() {
  const apiJson = useApiJson();
  const { hubProcessorId } = useParams<{ hubProcessorId: string }>();
  const [refreshSeed, setRefreshSeed] = useState<number>(0);
  const [refreshSeed2, setRefreshSeed2] = useState<any>(0);
  const navigate = useNavigate();

  let emptyFacility: Facility = {
    facilityId: -1,
    facilityName: "",
    xCoordinate: 0,
    yCoordinate: 0,
    facilityDetail: "",
    facilityDetailJson: undefined,
    isSheltered: false,
    hubProcessors: []
  };

  let emptyHub: Hub = {
    hubProcessorId: -1,
    processorName: "",
    ipAddressName: "",
    lastDataUpdate: null,
    hubSecret: "",
    hubStatus: HubStatus.PENDING,
    facility: emptyFacility,
    sensors: []
  };


  const [curHub, setCurHub] = useState<Hub>(emptyHub);
  const { tab } = useParams<{ tab: string }>();

  useEffect(() => {
    apiJson.post(
      `http://localhost:3000/api/assetFacility/getHub/${hubProcessorId}`,
      { includes: ["sensors", "facility"] }).then(res => {
        for (const sensor of res.hubProcessor.sensors){
          sensor.dateOfActivation = new Date(sensor.dateOfActivation).toLocaleString()
          sensor.dateOfLastMaintained = new Date(sensor.dateOfLastMaintained).toLocaleString()
        }
        setCurHub(res.hubProcessor as Hub);
      }).catch(e => console.log(e)).then(()=>setRefreshSeed2([]));
  }, [refreshSeed]);

  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-lg">
        <div className="flex justify-between">
          <Button variant={"outline"} type="button" onClick={() => navigate(-1)} className="">
            Back
          </Button>
          <span className="self-center text-lg text-graydark">
            View Hub Details
          </span>
          <Button disabled className="invisible">
            Back
          </Button>
        </div>
        <hr className="bg-stroke opacity-20" />
        <span className=" self-center text-title-xl font-bold">
          {curHub.processorName}
        </span>
        <Tabs
          defaultValue={tab ? `${tab}` : "hubDetails"}
          className="w-full"
        ><TabsList className="no-scrollbar w-full justify-around overflow-x-auto px-4 text-xs xl:text-base">
            <TabsTrigger value="hubDetails">Hub Details</TabsTrigger>
            {curHub.hubStatus != HubStatus.PENDING && <TabsTrigger value="sensors">Sensors</TabsTrigger>}
          </TabsList>
          <TabsContent value="hubDetails">
            <ViewHubDetails curHub={curHub} refreshSeed={refreshSeed}
              setRefreshSeed={setRefreshSeed} />
          </TabsContent>
          <TabsContent value="sensors">
            <AllSensorDatatable curHub={curHub} refreshSeed={refreshSeed2} />
          </TabsContent>
        </Tabs>
      </div>
    </div>

  );
}

export default ViewHubDetailsPage;