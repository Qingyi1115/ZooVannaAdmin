import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef, useState } from "react";
import { HiCheck, HiEye, HiPlus, HiX } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { Biome, EnclosureStatus } from "../../../enums/Enumurated";
import useApiJson from "../../../hooks/useApiJson";
import { useAuthContext } from "../../../hooks/useAuthContext";
import Animal from "../../../models/Animal";
import Enclosure from "../../../models/Enclosure";
import { useToast } from "../../../shadcn/components/ui/use-toast";
import Plantation from "../../../models/Plantation";
import Facility from "../../../models/Facility";

let emptyPlantation: Plantation = {
  plantationId: -1,
  name: "",
  biome: Biome.AQUATIC,
};

let emptyFacility: Facility = {
  facilityId: -1,
  facilityName: "",
  showOnMap: false,
  xCoordinate: 0,
  yCoordinate: 0,
  facilityDetail: "",
  facilityDetailJson: {},
  isSheltered: false,
  hubProcessors: [],
  imageUrl: "",
};

let emptyEnclosure: Enclosure = {
  enclosureId: -1,
  name: "No enclosure assigned",
  remark: null,
  length: 0,
  width: 0,
  height: 0,
  enclosureStatus: EnclosureStatus.ACTIVE,
  longGrassPercent: null,
  shortGrassPercent: null,
  rockPercent: null,
  sandPercent: null,
  snowPercent: null,
  soilPercent: null,
  landArea: null,
  waterArea: null,
  plantationCoveragePercent: null,
  acceptableTempMin: null,
  acceptableTempMax: null,
  acceptableHumidityMin: null,
  acceptableHumidityMax: null,
  animals: [],
  //   barrierType: null,
  //   plantation: null,
  zooEvents: [],
  //   facility: null,
  keepers: [],
  standOffBarrierDist: null,
  designDiagramJsonUrl: null,
  barrierType: null,
  plantation: emptyPlantation,
  facility: emptyFacility,
};

interface EnclosureCardProps {
  curAnimal: Animal;
  refreshSeed: number;
  setRefreshSeed: any;
}

function EnclosureCard(props: EnclosureCardProps) {
  const apiJson = useApiJson();
  const { curAnimal, refreshSeed, setRefreshSeed } = props;
  // const [refreshSeed, setRefreshSeed] = useState<number>(0);
  const navigate = useNavigate();
  const employee = useAuthContext().state.user?.employeeData;
  const [curEnclosure, setCurEnclosure] = useState<Enclosure>(
    curAnimal.enclosure ?? emptyEnclosure
  );
  const [openAddEnclosureDialog, setOpenAddEnclosureDialog] =
    useState<boolean>(false);
  const [removeEnclosureDialog, setRemoveEnclosureDialog] =
    useState<boolean>(false);
  const toastShadcn = useToast().toast;
  const [allEnclosureList, setAllEnclosureList] = useState<Enclosure[]>([]);
  const [selectedEnclosure, setSelectedEnclosure] =
    useState<Enclosure>(emptyEnclosure);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [addEnclosureError, setAddEnclosureError] = useState<string | null>(
    null
  );
  const dt = useRef<DataTable<Enclosure[]>>(null);
  useEffect(() => {
    const fetchEnclosures = async () => {
      try {
        const responseJson = await apiJson.get(
          "http://localhost:3000/api/enclosure/getAllEnclosures"
        );
        setAllEnclosureList(responseJson as Enclosure[]);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchEnclosures();
  }, [refreshSeed]);

  const imageBodyTemplate = (rowData: Enclosure) => {
    return rowData.facility ? (
      <img
        src={"http://localhost:3000/" + rowData.facility.imageUrl}
        alt={rowData.name}
        className="aspect-square w-16 rounded-full border border-white object-cover shadow-4"
      />
    ) : (
      "-"
    );
  };

  const actionBodyTemplate = (enclosure: Enclosure) => {
    return (
      <React.Fragment>
        <div className="mx-auto">
          <Button
            className="mr-2"
            onClick={() => {
              navigate(
                `/enclosure/viewenclosuredetails/${enclosure.enclosureId}`
              );
            }}
          >
            <HiPlus className="mr-auto" />
          </Button>
        </div>
      </React.Fragment>
    );
  };

  function handleAddEnclosure() {
    if (!selectedEnclosure) {
      return;
    }

    const addEnclosureApi = async () => {
      try {
        const assignAnimalApiObj = {
          enclosureId: selectedEnclosure.enclosureId,
          animalCode: curAnimal.animalCode,
        };
        console.log("assignAnimalApiObj", assignAnimalApiObj);
        const responseJson = await apiJson.put(
          `http://localhost:3000/api/enclosure/assignAnimalToEnclosure/`,
          assignAnimalApiObj
        );
        // .then((res) => {
        // setCurEnclosure(selectedEnclosure);
        // setSelectedEnclosure(emptyEnclosure);
        // setRefreshSeed(refreshSeed + 1);
        // })
        // .catch((err) => console.log("err", err));
        // success

        toastShadcn({
          description:
            "Successfully assigned " +
            curAnimal.houseName +
            " the " +
            curAnimal.species?.commonName +
            " to " +
            selectedEnclosure.name,
        });
        setOpenAddEnclosureDialog(false);
        setSelectedEnclosure(emptyEnclosure);
        setCurEnclosure(selectedEnclosure);
        setRefreshSeed(refreshSeed + 1);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while adding enclosure: \n" + error.message,
        });
        // setAddEnclosureError(error.message);
      }
    };
    addEnclosureApi();
  }

  // remove enclosure stuff
  const confirmRemoveEnclosure = (enclosure: Enclosure) => {
    setSelectedEnclosure(enclosure);
    setRemoveEnclosureDialog(true);
  };

  const hideRemoveEnclosureDialog = () => {
    setRemoveEnclosureDialog(false);
  };

  const removeEnclosure = async () => {
    const removeAnimalApiObj = {
      enclosureId: curEnclosure.enclosureId,
      animalCode: curAnimal.animalCode,
    };

    const removeEnclosureApi = async () => {
      console.log(curAnimal.animalCode);
      try {
        const responseJson = await apiJson.put(
          "http://localhost:3000/api/enclosure/removeAnimalFromEnclosure/",
          removeAnimalApiObj
        );

        toastShadcn({
          title: "Deletion Successful",
          description:
            "Successfully removed animal: " +
            curAnimal.houseName +
            " the " +
            curAnimal.species?.commonName +
            " from the enclosure",
        });
        setRemoveEnclosureDialog(false);
        setSelectedEnclosure(emptyEnclosure);
        setCurEnclosure(emptyEnclosure);
        setRefreshSeed(refreshSeed + 1);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while removing enclosure: \n" +
            apiJson.error,
        });
      }
    };
    removeEnclosureApi();
  };

  const removeEnclosureDialogFooter = (
    <React.Fragment>
      <Button onClick={hideRemoveEnclosureDialog}>
        <HiX className="mr-2" />
        No
      </Button>
      <Button variant={"destructive"} onClick={removeEnclosure}>
        <HiCheck className="mr-2" />
        Yes
      </Button>
    </React.Fragment>
  );
  // end remove enclosure stuff

  // add enclosure stuff
  interface AnimalCompatibilities {
    enclosureId: number;
    compatible: boolean;
  }
  const [isCurAnimalCompatibleList, setIsCurAnimalCompatibleList] = useState<
    AnimalCompatibilities[]
  >(
    allEnclosureList.map((enclosure) => ({
      enclosureId: enclosure.enclosureId,
      compatible: false,
    }))
  );

  useEffect(() => {
    // Update curEnclosureBarrierList when enclosureWallList changes
    setIsCurAnimalCompatibleList(
      allEnclosureList?.map((enclosure) => ({
        enclosureId: enclosure.enclosureId,
        compatible: false,
      }))
    );
  }, [allEnclosureList]);

  useEffect(() => {
    let tempCurAnimalCompatibilityList = [...isCurAnimalCompatibleList];

    allEnclosureList.forEach(async (enclosure) => {
      const responseJson = await apiJson.get(
        `http://localhost:3000/api/enclosure/getSpeciesCompatibilityInEnclosure/${enclosure.enclosureId}/${curAnimal.species.speciesCode}`
      );
      const isSpeciesCompatibleWithEnclosure =
        responseJson.isCompatible as boolean;
      // console.log(
      //   "heree, enclosure id: " +
      //     enclosure.enclosureId +
      //     ", compatible: " +
      //     isSpeciesCompatibleWithEnclosure
      // );
      // Find the index of the item with matching enclosureId
      const index = tempCurAnimalCompatibilityList.findIndex(
        (item) => item.enclosureId === enclosure.enclosureId
      );
      // If found, update the compatible field
      if (index !== -1) {
        tempCurAnimalCompatibilityList[index].compatible =
          isSpeciesCompatibleWithEnclosure;
      }
    });
  }, [isCurAnimalCompatibleList]);

  const addEnclosuresHeader = (
    <React.Fragment>
      <div className="flex justify-center text-2xl">Add Enclosure</div>
    </React.Fragment>
  );
  const addEnclosuresFooter = (
    <React.Fragment>
      <div className="mt-6 flex flex-col items-center">
        <Button
          disabled={
            selectedEnclosure == null || selectedEnclosure == emptyEnclosure
          }
          onClick={handleAddEnclosure}
        >
          {selectedEnclosure == null || selectedEnclosure == emptyEnclosure
            ? "Add"
            : "Add " + selectedEnclosure.name}
        </Button>
        <div className="mt-2 font-medium">
          Note: you can still assign an animal to an INCOMPATIBLE enclosure
        </div>
      </div>
      <div>
        {addEnclosureError && (
          <div className="mt-2 flex justify-center font-bold text-danger">
            {addEnclosureError}
          </div>
        )}
      </div>
    </React.Fragment>
  );

  const animalCompatibilityFormat = (enclosure: Enclosure) => {
    let isCurAnimalCompatible = false;
    const index = isCurAnimalCompatibleList.findIndex(
      (item) => item.enclosureId === enclosure.enclosureId
    );
    // If found, update the compatible field
    if (index !== -1) {
      isCurAnimalCompatible = isCurAnimalCompatibleList[index].compatible;
    }

    return (
      <React.Fragment>
        {isCurAnimalCompatible ? (
          <span className="flex items-center justify-center rounded bg-emerald-100 p-[0.1rem] px-2 text-base font-bold text-emerald-900">
            COMPATIBLE
          </span>
        ) : (
          <span className="flex items-center justify-center rounded bg-red-100 p-[0.1rem] px-2 text-base font-bold text-red-900">
            INCOMPATIBLE
          </span>
        )}
      </React.Fragment>
    );
  };

  const addEnclosureBody = (
    <React.Fragment>
      <Dialog
        visible={openAddEnclosureDialog}
        onHide={() => setOpenAddEnclosureDialog(false)}
        style={{ width: "64rem", height: "48rem" }}
        header={addEnclosuresHeader}
        footer={addEnclosuresFooter}
      >
        <div className="mt-2 flex flex-col items-center">
          <InputText
            type="search"
            placeholder="Search..."
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              setGlobalFilter(target.value);
            }}
            className="mb-2 h-min w-60"
          />
        </div>
        {/* {isCurAnimalCompatibleList.map((compatible) => (
          <div>
            id: {compatible.enclosureId} - {compatible.compatible.toString()}
          </div>
        ))} */}
        <DataTable
          ref={dt}
          value={allEnclosureList}
          scrollable
          scrollHeight="100%"
          selection={selectedEnclosure}
          selectionMode="single"
          onSelectionChange={(e) => setSelectedEnclosure(e.value)}
          dataKey="enclosureId"
          paginator
          // showGridlines
          rows={25}
          rowsPerPageOptions={[10, 25, 50, 100]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} enclosures"
          globalFilter={globalFilter}
          // header={addEnclosuresHeader}
        >
          <Column
            field="imageUrl"
            header="Image"
            frozen
            body={imageBodyTemplate}
            style={{ minWidth: "6rem" }}
          ></Column>
          {/* <Column
            field="enclosureId"
            header="ID"
            sortable
            style={{ minWidth: "4rem" }}
          ></Column> */}
          <Column
            field="name"
            header="Name"
            sortable
            style={{ minWidth: "6rem" }}
          ></Column>
          <Column
            field="remark"
            header="Remark(s)"
            sortable
            style={{ minWidth: "6rem" }}
          ></Column>
          <Column
            field="enclosureStatus"
            header="Compatibility Recommendation"
            body={animalCompatibilityFormat}
            sortable
            style={{ minWidth: "6rem" }}
          ></Column>
          {/*  */}
        </DataTable>
      </Dialog>
      <Dialog
        visible={removeEnclosureDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={removeEnclosureDialogFooter}
        onHide={hideRemoveEnclosureDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedEnclosure && (
            <span>
              Are you sure you want to remove{" "}
              <b>
                {curAnimal.houseName} the {curAnimal.species?.commonName}
              </b>{" "}
              from {curEnclosure.name}?
            </span>
          )}
        </div>
      </Dialog>
    </React.Fragment>
  );

  return (
    <Card className="w-full transition-all hover:bg-muted/50">
      <CardContent className="h-full px-4 pb-4 pt-3">
        <div className="mb-2 text-sm font-bold text-slate-700">Enclosure</div>
        <div className="flex items-center gap-4">
          {curEnclosure.enclosureId != -1 ? (
            <img
              alt={""}
              src={
                curEnclosure.enclosureId != -1
                  ? "http://localhost:3000/" + curEnclosure.facility.imageUrl
                  : "../../../../src/assets/enclosureIconPlaceholder.jpg"
              }
              className="aspect-square w-20 rounded-full border border-white object-cover shadow-4"
            />
          ) : (
            <div className="h-20 w-20"></div>
          )}
          {curEnclosure.enclosureId != -1 ? (
            <div>{curEnclosure.name}</div>
          ) : (
            <div>No enclosure assigned</div>
          )}
          <div className="ml-auto flex items-center">
            {curEnclosure.enclosureId != -1 ? (
              <div>
                <Button
                  className="mr-2"
                  onClick={() => {
                    navigate(
                      `/animal/viewanimaldetails/${curAnimal.animalCode}`,
                      { replace: true }
                    );
                    navigate(
                      `/enclosure/viewenclosuredetails/${curEnclosure.enclosureId}`
                    );
                  }}
                >
                  <HiEye className="mx-auto" />
                </Button>
                {(employee.superAdmin ||
                  employee.keeper ||
                  employee.planningStaff?.plannerType == "CURATOR") && (
                  <Button
                    variant={"destructive"}
                    onClick={() => {
                      setRemoveEnclosureDialog(true);
                    }}
                  >
                    <HiX />
                  </Button>
                )}
              </div>
            ) : (
              (employee.superAdmin ||
                employee.keeper ||
                employee.planningStaff?.plannerType == "CURATOR") && (
                <Button
                  onClick={() => {
                    setOpenAddEnclosureDialog(true);
                  }}
                >
                  Assign An Enclosure
                  <HiPlus className="ml-4" />
                </Button>
              )
            )}
            {addEnclosureBody}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default EnclosureCard;
