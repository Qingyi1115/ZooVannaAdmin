import { useEffect, useState } from "react";
import useApiJson from "../../hooks/useApiJson";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AllAnimalObservationLogsDatatable from "../../components/AnimalManagement/ViewAnimalDetailsPage/AllAnimalObservationLogsDatatable";
import AnimalActivityInfo from "../../components/AnimalManagement/ViewAnimalDetailsPage/AnimalActivityInfo";
import AnimalBasicInformation from "../../components/AnimalManagement/ViewAnimalDetailsPage/AnimalBasicInformation";
import AnimalWeightInfo from "../../components/AnimalManagement/ViewAnimalDetailsPage/AnimalWeightInfo";
import Animal from "../../models/Animal";

import AllAnimalActivityLogsDatatable from "../../components/AnimalManagement/ViewAnimalDetailsPage/AllAnimalActivityLogsDatatable";
import AllAnimalFeedingLogsDatatable from "../../components/AnimalManagement/ViewAnimalDetailsPage/AllAnimalFeedingLogsDatatable";
import { useAuthContext } from "../../hooks/useAuthContext";

function ViewAnimalDetailsPage() {
  const apiJson = useApiJson();
  const location = useLocation();
  const navigate = useNavigate();
  const employee = useAuthContext().state.user?.employeeData;
  const { animalCode } = useParams<{ animalCode: string }>();
  const { tab } = useParams<{ tab: string }>();

  const [curAnimal, setCurAnimal] = useState<Animal | null>(null);
  const [refreshSeed, setRefreshSeed] = useState<number>(0);

  // useEffect to fetch animal
  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/animal/getAnimalByAnimalCode/${animalCode}`
        );
        console.log("test");
        setCurAnimal(responseJson as Animal);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchAnimal();
  }, [refreshSeed, location.pathname]);

  return (
    <div className="p-10">
      {curAnimal && (
        <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-lg">
          {/* header */}
          <div className="flex flex-col">
            <div className="mb-4 flex justify-between">
              {/* <NavLink className="flex" to={`/animal/viewallanimals/`}> */}
              <Button
                variant={"outline"}
                type="button"
                className=""
                onClick={() => navigate(-1)}
              >
                Back
              </Button>
              {/* </NavLink> */}
              <span className="self-center text-lg text-graydark">
                Animal Details
              </span>
              <Button disabled className="invisible">
                Back
              </Button>
            </div>
            <Separator />
            <span className="mt-4 self-center text-title-xl font-bold">
              {curAnimal.houseName}{" "}
              {curAnimal.isGroup ? (
                ""
              ) : (
                <span>the {curAnimal.species.commonName}</span>
              )}
              <div className="text-center text-lg">
                {curAnimal.isGroup ? (
                  <span>(Group)</span>
                ) : (
                  <span>(Individual)</span>
                )}
              </div>
            </span>
            <img
              src={"http://localhost:3000/" + curAnimal.imageUrl}
              alt="Current animal image"
              className="my-4 aspect-square w-1/5 self-center rounded-full border object-cover shadow-4"
            />
          </div>
          {/*  */}
          <Tabs defaultValue={tab ? `${tab}` : "basicinfo"} className="w-full">
            <TabsList className="no-scrollbar mb-4 w-full justify-around overflow-x-auto px-4 text-xs xl:text-base">
              <span className="invisible">_____</span>
              <TabsTrigger value="basicinfo">Basic Information</TabsTrigger>
              {(employee.superAdmin || employee.keeper || employee.planningStaff?.plannerType == "CURATOR") && <TabsTrigger value="weight">Weight</TabsTrigger>}
              <TabsTrigger value="feeding">Feeding</TabsTrigger>
              <TabsTrigger value="trainingenrichmentactivity">
                Activities
              </TabsTrigger>
              <TabsTrigger value="behaviour">Observation Logs</TabsTrigger>
              <TabsTrigger value="activitylogs">Activity Logs</TabsTrigger>
              <TabsTrigger value="feedinglogs">Feeding Logs</TabsTrigger>
              {/* <TabsTrigger value="medical">Medical</TabsTrigger> */}
            </TabsList>
            <TabsContent value="basicinfo">
              <AnimalBasicInformation
                curAnimal={curAnimal}
                setCurAnimal={setCurAnimal}
                refreshSeed={refreshSeed}
                setRefreshSeed={setRefreshSeed}
              />
            </TabsContent>
            <TabsContent value="weight">
              <div>
                <AnimalWeightInfo curAnimal={curAnimal} />
              </div>
            </TabsContent>
            <TabsContent value="feeding">
              <div>
                <span>Feeding Plan</span>
              </div>
            </TabsContent>
            <TabsContent value="trainingenrichmentactivity">
              <div>
                <AnimalActivityInfo curAnimal={curAnimal} />
              </div>
            </TabsContent>
            <TabsContent value="behaviour">
              <div>
                <AllAnimalObservationLogsDatatable
                  speciesCode={curAnimal.species.speciesCode}
                  animalCode={curAnimal.animalCode}
                  animalActivityId={-1}
                />
              </div>
            </TabsContent>
            <TabsContent value="feedinglogs">
              <div>
                <AllAnimalFeedingLogsDatatable
                  speciesCode={curAnimal.species.speciesCode}
                  animalCode={curAnimal.animalCode}
                />
              </div>
            </TabsContent>
            <TabsContent value="activitylogs">
              <div>
                <AllAnimalActivityLogsDatatable
                  speciesCode={curAnimal.species.speciesCode}
                  animalCode={curAnimal.animalCode}
                  animalActivityId={-1}
                />
              </div>
            </TabsContent>
            {/* <TabsContent value="medical">
              Medical Logs and whatever else here
            </TabsContent> */}
          </Tabs>
        </div>
      )}
    </div>
  );
}

export default ViewAnimalDetailsPage;
