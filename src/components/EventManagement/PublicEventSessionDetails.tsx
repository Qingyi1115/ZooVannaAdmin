





import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useApiJson from "../../hooks/useApiJson";
import Animal from "../../models/Animal";
import AnimalActivity from "../../models/AnimalActivity";
import EnrichmentItem from "../../models/EnrichmentItem";
import Species from "../../models/Species";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableRow
} from "@/components/ui/table";
import { NavLink } from "react-router-dom";

import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";

import { useToast } from "@/components/ui/use-toast";
import { HiCheck, HiTrash, HiX } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

import { Dialog } from "primereact/dialog";
import AllAnimalActivityLogsDatatable from "../../components/AnimalManagement/ViewAnimalDetailsPage/AllAnimalActivityLogsDatatable";
import AllAnimalObservationLogsDatatable from "../../components/AnimalManagement/ViewAnimalDetailsPage/AllAnimalObservationLogsDatatable";
import {
  AcquisitionMethod,
  ActivityType,
  AnimalGrowthStage,
  AnimalSex,
} from "../../enums/Enumurated";
import beautifyText from "../../hooks/beautifyText";
import { useAuthContext } from "../../hooks/useAuthContext";
import AllPublicEventSessionDatatable from "../../components/EventManagement/AllPublicEventSessionsDatatable";
import PublicEvent from "../../models/PublicEvent";
import PublicEventSession from "../../models/PublicEventSession";

interface ViewPublicEventSessionDetailsProps {
  publicEventSession: PublicEventSession;
}

function ViewPublicEventSessionDetails(prop: ViewPublicEventSessionDetailsProps) {
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;
  const { publicEventSession } = prop;

  const { publicEventId } = useParams<{ publicEventId: string }>();

  const [curPublicEventSession, setCurPublicEventSession] =
    useState<PublicEventSession | null>(null);
  const [refreshSeed, setRefreshSeed] = useState<number>(0);

  const [involvedAnimalList, setInvolvedAnimalList] = useState<Animal[]>();
  const [involvedAnimalGlobalFiler, setInvolvedAnimalGlobalFilter] =
    useState<string>("");
  const employee = useAuthContext().state.user?.employeeData;

  useEffect(() => {
    const fetchAnimalActivity = async () => {
      try {
        console.log("ViewPublicEventSessionDetails", publicEventSession)
        setCurPublicEventSession(publicEventSession);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchAnimalActivity();
  }, [publicEventSession]);

  const animalImageBodyTemplate = (rowData: Animal) => {
    return (
      <img
        src={"http://localhost:3000/" + rowData.imageUrl}
        alt={rowData.houseName}
        className="aspect-square w-16 rounded-full border border-white object-cover shadow-4"
      />
    );
  };

  const enrichmentItemImageBodyTemplate = (rowData: EnrichmentItem) => {
    return (
      <img
        src={"http://localhost:3000/" + rowData.enrichmentItemImageUrl}
        alt={rowData.enrichmentItemName}
        className="aspect-square w-16 rounded-full border border-white object-cover shadow-4"
      />
    );
  };

  /////
  // remove animal stuff
  const [selectedAnimal, setSelectedAnimal] = useState<Animal>();
  const [removeAnimalDialog, setRemoveAnimalDialog] = useState<boolean>(false);
  const confirmRemoveAnimal = (animal: Animal) => {
    setSelectedAnimal(animal);
    setRemoveAnimalDialog(true);
  };

  const hideRemoveAnimalDialog = () => {
    setRemoveAnimalDialog(false);
  };

  const removeAnimal = async () => {
    if (involvedAnimalList == undefined) {
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Involved animal list is invalid",
      });
      return;
    }

    let _animals = involvedAnimalList.filter(
      (val) => val.animalId !== selectedAnimal?.animalId
    );

    const animalToRemoveApiObj = {
      ...curPublicEventSession,
      animalCodes: _animals.map(animal => animal.animalCode),
    };

    const removeAnimalApi = async () => {
      try {
        const responseJson = await apiJson.put(
          `http://localhost:3000/api/zooEvent/updatePublicEventById/${curPublicEventSession?.publicEventId}`,
          animalToRemoveApiObj
        );

        toastShadcn({
          // variant: "destructive",
          title: "Deletion Successful",
          description:
            "Successfully removed animal: " +
            selectedAnimal.houseName +
            " from the activity",
        });
        setInvolvedAnimalList(_animals);
        setRemoveAnimalDialog(false);
        setSelectedAnimal(emptyAnimal);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while removing animal from activity: \n" +
            error.message,
        });
      }
    };
    removeAnimalApi();
  };

  const removeAnimalDialogFooter = (
    <React.Fragment>
      <Button onClick={hideRemoveAnimalDialog}>
        <HiX className="mr-2" />
        No
      </Button>
      <Button variant={"destructive"} onClick={removeAnimal}>
        <HiCheck className="mr-2" />
        Yes
      </Button>
    </React.Fragment>
  );

  ////
  const animalActionBodyTemplate = (animal: Animal) => {
    return (
      <React.Fragment>
        <div className="mx-auto">
          <Button
            variant={"destructive"}
            className="mr-2"
            onClick={() => confirmRemoveAnimal(animal)}
          >
            <HiTrash className="mx-auto" />
          </Button>
        </div>
      </React.Fragment>
    );
  };

  /////
  // remove item stuff
  const [selectedItem, setSelectedItem] = useState<EnrichmentItem>();
  const [removeItemDialog, setRemoveItemDialog] = useState<boolean>(false);
  const confirmRemoveItem = (item: EnrichmentItem) => {
    setSelectedItem(item);
    setRemoveItemDialog(true);
  };

  const hideRemoveItemDialog = () => {
    setRemoveItemDialog(false);
  };

  ////
  const itemActionBodyTemplate = (item: EnrichmentItem) => {
    return (
      <React.Fragment>
        <div className="mx-auto">
          <Button
            variant={"destructive"}
            className="mr-2"
            onClick={() => confirmRemoveItem(item)}
          >
            <HiTrash className="mx-auto" />
          </Button>
        </div>
      </React.Fragment>
    );
  };

  return (
    <div className="p-10">
      {curPublicEventSession && (
        <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-lg">
          <div className="mb-10">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="w-1/3 font-bold" colSpan={2}>
                    Public Event Name
                  </TableCell>
                  <TableCell>
                    {curPublicEventSession.publicEvent?.title}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="w-1/3 font-bold" colSpan={2}>
                    Recurring Pattern
                  </TableCell>
                  <TableCell>{beautifyText(curPublicEventSession.recurringPattern)}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="w-1/3 font-bold" colSpan={2}>
                    Frequency
                  </TableCell>
                  <TableCell>
                    {curPublicEventSession.recurringPattern == "WEEKLY" ?
                      beautifyText(curPublicEventSession.dayOfWeek) :
                      curPublicEventSession.dayOfMonth
                    }
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="w-1/3 font-bold" colSpan={2}>
                    Duration in minutes
                  </TableCell>
                  <TableCell>
                    {curPublicEventSession.durationInMinutes}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="w-1/3 font-bold" colSpan={2}>
                    Details
                  </TableCell>
                  <TableCell>{curPublicEventSession.publicEvent?.details}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="flex w-full gap-20">
            <div className="w-full">
              <Dialog
                visible={removeAnimalDialog}
                style={{ width: "32rem" }}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                header="Confirm"
                modal
                footer={removeAnimalDialogFooter}
                onHide={hideRemoveAnimalDialog}
              >
                <div className="confirmation-content">
                  <i
                    className="pi pi-exclamation-triangle mr-3"
                    style={{ fontSize: "2rem" }}
                  />
                  {selectedAnimal && (
                    <span>
                      Are you sure you want to remove{" "}
                      {selectedAnimal.houseName} from the current
                      activity? ?
                    </span>
                  )}
                </div>
              </Dialog>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewPublicEventSessionDetails;
