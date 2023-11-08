import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";

import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

import { useParams } from "react-router-dom";
import useApiJson from "../../hooks/useApiJson";
import Animal from "../../models/Animal";
import Species from "../../models/Species";

import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { ImSpinner2 } from "react-icons/im";

let emptySpecies: Species = {
  speciesId: -1,
  speciesCode: "",
  commonName: "",
  scientificName: "",
  aliasName: "",
  conservationStatus: "",
  domain: "",
  kingdom: "",
  phylum: "",
  speciesClass: "",
  order: "",
  family: "",
  genus: "",
  nativeContinent: "",
  nativeBiomes: "",
  educationalDescription: "",
  educationalFunFact: "",
  groupSexualDynamic: "",
  habitatOrExhibit: "habitat",
  imageUrl: "",
  generalDietPreference: "",
  ageToJuvenile: 0,
  ageToAdolescent: 1,
  ageToAdult: 2,
  ageToElder: 3,
  lifeExpectancyYears: 0,
};

function simulateRandomLoadingTime() {
  const minDelay = 600; // Minimum delay in milliseconds
  const maxDelay = 1200; // Maximum delay in milliseconds
  const randomDelay =
    Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, randomDelay);
  });
}

function CheckIsInbreedingPage() {
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;

  const { speciesCode } = useParams<{ speciesCode: string }>();
  const [curSpecies, setCurSpecies] = useState<Species>(emptySpecies);
  const [refreshSeed, setRefreshSeed] = useState<number>(0);

  const [selectedAnimal1, setSelectedAnimal1] = useState<Animal | null>(null);
  const [selectedAnimal2, setSelectedAnimal2] = useState<Animal | null>(null);
  const [allAnimalsList, setAllAnimalsList] = useState<Animal[]>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const [isInbreeding, setIsInbreeding] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/species/getspecies/${speciesCode}`
        );
        setCurSpecies(responseJson as Species);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchSpecies();
  }, [refreshSeed]);

  useEffect(() => {
    const fetchAnimalsBySpecies = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/animal/getAllAnimalsBySpeciesCode/${speciesCode}`
        );
        setAllAnimalsList(responseJson as Animal[]);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchAnimalsBySpecies();
  }, []);

  ///
  const animalImageBodyTemplate = (rowData: Animal) => {
    return (
      <img
        src={"http://localhost:3000/" + rowData.imageUrl}
        alt={rowData.houseName}
        className="aspect-square w-16 rounded-full border border-white object-cover shadow-4"
      />
    );
  };

  async function submitCheckIsInbreeding() {
    if (!selectedAnimal1 || !selectedAnimal2) {
      toastShadcn({
        variant: "destructive",
        title: "Error",
        description: "Two animals must be selected!",
      });
      return;
    }
    if (selectedAnimal1?.animalCode == selectedAnimal2.animalCode) {
      toastShadcn({
        variant: "destructive",
        title: "Error",
        description: "Two animals selected must be DIFFERENT!",
      });
      return;
    }
    setIsLoading(true);
    // await simulateRandomLoadingTime();

    const checkIsInbreedingApi = async () => {
      try {
        const response = await apiJson.get(
          `http://localhost:3000/api/animal/checkInbreeding/${selectedAnimal1.animalCode}/${selectedAnimal2.animalCode}`
        );
        // success
        await simulateRandomLoadingTime();
        toastShadcn({
          description: "Successfully obtained inbreeding check results",
        });
        setIsInbreeding(response as boolean);
      } catch (error: any) {
        // got error
        await simulateRandomLoadingTime();
        setIsLoading(false);
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while adding animal(s) to animal activity: \n" +
            error.message,
        });
      }
    };
    await checkIsInbreedingApi();
    setIsLoading(false);
  }

  function clearAnimals() {
    setSelectedAnimal1(null);
    setSelectedAnimal2(null);
    setIsInbreeding(null);
  }

  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-lg">
        {/* Header */}
        <div className="flex flex-col">
          <div className="mb-4 flex justify-between">
            <Button
              variant={"outline"}
              onClick={() => navigate(-1)}
              type="button"
              className=""
            >
              Back
            </Button>
            <span className="self-center text-lg text-graydark">
              Check Possible Inbreeding
            </span>
            <Button disabled className="invisible">
              Back
            </Button>
          </div>
          <Separator />
          <span className="mt-4 self-center text-title-xl font-bold">
            {curSpecies?.commonName}
          </span>
          <div className="my-4 w-full text-center font-medium">
            Select two individual animals and check to see if it can result in
            inbreeding if they mate together
          </div>
        </div>
        {/* body */}
        <div>
          <br />
          <div className="flex w-full justify-center">
            <div
              className={`mb-6 flex h-min rounded-md text-primary-foreground transition-all duration-200 ease-in-out ${
                isInbreeding == null
                  ? "w-96"
                  : isInbreeding
                  ? "w-full bg-destructive p-4"
                  : "w-full bg-primary p-4"
              }`}
            >
              {isInbreeding == null ? (
                <Button
                  variant={"outline"}
                  className="h-10 w-full  text-black transition-all"
                  disabled={!selectedAnimal1 || !selectedAnimal2 || isLoading}
                  onClick={submitCheckIsInbreeding}
                >
                  {!isLoading ? (
                    <div className="text-lg">Check Is Inbreeding</div>
                  ) : (
                    <div className="flex items-center justify-center p-10 text-lg">
                      <ImSpinner2 className="mr-3 h-5 w-5 animate-spin" />{" "}
                      Family Calculating...
                    </div>
                  )}
                </Button>
              ) : (
                <div className="w-full text-center">
                  <div>Results:</div>
                  <div className="my-2">
                    {isInbreeding != null && isInbreeding ? (
                      <span className="text-xl font-bold">
                        IS INBREEDING. UNSAFE.
                      </span>
                    ) : (
                      <span className="text-xl font-bold">
                        IS NOT INBREEDING. SAFE.
                      </span>
                    )}
                  </div>
                  <div>
                    According to current lineage data, breeding between{" "}
                    {selectedAnimal1?.houseName} and{" "}
                    {selectedAnimal2?.houseName} is safe and is unlikely to
                    result in inbreeding.{" "}
                  </div>
                  <Button
                    onClick={clearAnimals}
                    className="mb-2 mt-4 border-none bg-white text-black hover:bg-slate-200"
                  >
                    Clear selected animals and check again
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="flex w-full gap-20">
            {/* animal 1 */}
            <div className="flex w-full flex-col gap-4">
              <div className="mb-2 text-xl font-medium">
                <div className="mb-4">Selected First Animal:</div>
                {selectedAnimal1 ? (
                  <div className="flex h-24 w-full flex-wrap items-center gap-4 rounded-md border border-strokedark/70 p-4">
                    <img
                      className="aspect-square h-16 w-16 rounded-full border border-white object-cover shadow-4"
                      src={`http://localhost:3000/${selectedAnimal1.imageUrl}`}
                      alt={selectedAnimal1.houseName}
                    />
                    <div className="flex flex-1 flex-col justify-center gap-1 text-base">
                      <div className="font-bold">
                        {selectedAnimal1.houseName}
                      </div>
                      <div className="flex flex-col items-start gap-1">
                        <span>{selectedAnimal1.animalCode}</span>
                      </div>
                    </div>
                    {/* <span className="font-bold text-900">${item.price}</span> */}
                  </div>
                ) : (
                  <div className="flex h-24 w-full flex-wrap items-center gap-3 rounded-md border border-strokedark/70 p-4">
                    <div className="text-base text-destructive">
                      Please select an animal below
                    </div>
                  </div>
                )}
              </div>
              <InputText
                type="search"
                placeholder="Search for animal..."
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  setGlobalFilter(target.value);
                }}
              />
              <DataTable
                value={allAnimalsList}
                scrollable
                scrollHeight="100%"
                selection={selectedAnimal1!}
                selectionMode="single"
                globalFilter={globalFilter}
                onSelectionChange={(e) => setSelectedAnimal1(e.value)}
                style={{ height: "50vh" }}
                dataKey="animalCode"
                className="h-1/2 overflow-hidden rounded border border-graydark/30"
              >
                <Column
                  field="imageUrl"
                  body={animalImageBodyTemplate}
                  style={{ minWidth: "3rem" }}
                ></Column>
                <Column
                  field="animalCode"
                  header="Code"
                  sortable
                  style={{ minWidth: "7rem" }}
                ></Column>
                <Column
                  field="houseName"
                  header="House Name"
                  sortable
                  style={{ minWidth: "5rem" }}
                ></Column>
                {/* <Column
                        body={animalActionBodyTemplate}
                        header="Actions"
                        exportable={false}
                        style={{ minWidth: "3rem" }}
                      ></Column> */}
              </DataTable>
            </div>
            {/* animal 2 */}
            <div className="flex w-full flex-col gap-4">
              <div className="mb-2 text-xl font-medium">
                <div className="mb-4">Selected Second Animal:</div>
                {selectedAnimal2 ? (
                  <div className="flex h-24 w-full flex-wrap items-center gap-4 rounded-md border border-strokedark/70 p-4">
                    <img
                      className="aspect-square h-16 w-16 rounded-full border border-white object-cover shadow-4"
                      src={`http://localhost:3000/${selectedAnimal2.imageUrl}`}
                      alt={selectedAnimal2.houseName}
                    />
                    <div className="flex flex-1 flex-col justify-center gap-1 text-base">
                      <div className="font-bold">
                        {selectedAnimal2.houseName}
                      </div>
                      <div className="flex flex-col items-start gap-1">
                        <span>{selectedAnimal2.animalCode}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-24 w-full flex-wrap items-center gap-3 rounded-md border border-strokedark/70 p-4">
                    <div className="text-base text-destructive">
                      Please select an animal below
                    </div>
                  </div>
                )}
              </div>
              <InputText
                type="search"
                placeholder="Search for animal..."
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  setGlobalFilter(target.value);
                }}
              />
              <DataTable
                value={allAnimalsList}
                scrollable
                scrollHeight="100%"
                selection={selectedAnimal2!}
                selectionMode="single"
                globalFilter={globalFilter}
                onSelectionChange={(e) => setSelectedAnimal2(e.value)}
                style={{ height: "50vh" }}
                dataKey="animalCode"
                className="h-1/2 overflow-hidden rounded border border-graydark/30"
              >
                <Column
                  field="imageUrl"
                  body={animalImageBodyTemplate}
                  style={{ minWidth: "3rem" }}
                ></Column>
                <Column
                  field="animalCode"
                  header="Code"
                  sortable
                  style={{ minWidth: "7rem" }}
                ></Column>
                <Column
                  field="houseName"
                  header="House Name"
                  sortable
                  style={{ minWidth: "5rem" }}
                ></Column>
                {/* <Column
                        body={animalActionBodyTemplate}
                        header="Actions"
                        exportable={false}
                        style={{ minWidth: "3rem" }}
                      ></Column> */}
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckIsInbreedingPage;
