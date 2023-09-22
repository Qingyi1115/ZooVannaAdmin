import React, { useEffect, useState } from "react";
import useApiJson from "../../../hooks/useApiJson";
import Species from "../../../models/Species";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import EnclosureCapabilitiesTable from "./EnclosureCapabilitiesTable";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";

interface SpeciesEnclosureCompatibilitiesProps {
  curSpecies: Species;
}

function SpeciesEnclosureCompatibilities(
  props: SpeciesEnclosureCompatibilitiesProps
) {
  const { curSpecies } = props;
  const apiJson = useApiJson();

  const [refreshSeed, setRefreshSeed] = useState<number>(0);
  const [compatibleSpeciesList, setCompatibleSpeciesList] = useState<Species[]>(
    []
  );
  const [selectedSpeciesToAdd, setSelectedSpeciesToAdd] =
    useState<Species | null>(null);
  const [selectedSpeciesToDelete, setSelectedSpeciesToDelete] =
    useState<Species | null>(null);
  const [allSpeciesListNoCurSpecies, setAllSpeciesListNoCurSpecies] = useState<
    Species[]
  >([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const [openCompatibleSpeciesDialog, setOpenCompatibleSpeciesDialog] =
    useState<boolean>(false);
  const [
    openDeleteCompatibleSpeciesDialog,
    setOpenDeleteCompatibleSpeciesDialog,
  ] = useState<boolean>(false);

  const toastShadcn = useToast().toast;

  useEffect(() => {
    const fetchSpeciesAllCompatibilities = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/species/getAllCompatibilitiesbySpeciesCode/${curSpecies.speciesCode}`
        );
        setCompatibleSpeciesList(responseJson as Species[]);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchSpeciesAllCompatibilities();
  }, [refreshSeed]);

  useEffect(() => {
    const fetchAllSpecies = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/species/getallspecies`
        );
        const speciesListNoCurSpecies = (responseJson as Species[]).filter(
          (species) => species.speciesCode !== curSpecies.speciesCode
        );
        setAllSpeciesListNoCurSpecies(speciesListNoCurSpecies);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchAllSpecies();
  }, []);

  // Datatable
  const imageBodyTemplate = (rowData: Species) => {
    return (
      <img
        src={"http://localhost:3000/" + rowData.imageUrl}
        alt={rowData.commonName}
        className="aspect-square w-16 rounded-full border border-white object-cover shadow-4"
      />
    );
  };

  // end datatable

  function handleAddCompatibleSpecies() {
    if (selectedSpeciesToAdd == null) {
      toastShadcn({
        variant: "destructive",
        description: "No species selected",
      });
      return;
    }
    const speciesCode1 = curSpecies.speciesCode;
    const speciesCode2 = selectedSpeciesToAdd.speciesCode;
    const createCompatibilityObj = {
      speciesCode1,
      speciesCode2,
    };

    const createCompatibility = async () => {
      try {
        const response = await apiJson.post(
          "http://localhost:3000/api/species/createCompatibility",
          createCompatibilityObj
        );
        // success
        toastShadcn({
          description: "Successfully added compatibility",
        });
        setRefreshSeed(refreshSeed + 1);
        setSelectedSpeciesToAdd(null);
        setOpenCompatibleSpeciesDialog(false);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while creating compatibility: \n" +
            error.message,
        });
      }
    };
    createCompatibility();
  }

  function handleDeleteCompatibleSpecies() {
    if (selectedSpeciesToDelete == null) {
      toastShadcn({
        variant: "destructive",
        description: "No species selected",
      });
      return;
    }
    const speciesCode1 = curSpecies.speciesCode;
    const speciesCode2 = selectedSpeciesToDelete.speciesCode;
    // const deleteCompatibilityObj = {
    //   speciesCode1,
    //   speciesCode2,
    // };

    const deleteCompatibilityApi = async () => {
      try {
        const response = await apiJson.del(
          `http://localhost:3000/api/species/deleteCompatibility/${speciesCode1}/${speciesCode2}`
        );
        // success
        toastShadcn({
          description: "Successfully deleted compatibility",
        });
        setRefreshSeed(refreshSeed + 1);
        setSelectedSpeciesToDelete(null);
        setOpenDeleteCompatibleSpeciesDialog(false);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while creating compatibility: \n" +
            error.message,
        });
      }
    };
    deleteCompatibilityApi();
  }

  return (
    <div className="my-4 flex flex-col items-start gap-4">
      <div className="flex gap-6">
        <div>
          {/* <Button> Add Compatible Species</Button> */}
          <Dialog
            open={openCompatibleSpeciesDialog}
            onOpenChange={setOpenCompatibleSpeciesDialog}
          >
            <DialogTrigger>
              <Button>Add Compatible Species</Button>
            </DialogTrigger>
            <DialogContent className="h-3/5">
              <DialogHeader>
                <DialogTitle>Add Compatible Species</DialogTitle>
              </DialogHeader>
              <InputText
                type="search"
                placeholder="Search..."
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  setGlobalFilter(target.value);
                }}
              />
              <DataTable
                value={allSpeciesListNoCurSpecies}
                scrollable
                scrollHeight="100%"
                selection={selectedSpeciesToAdd!}
                selectionMode="single"
                globalFilter={globalFilter}
                onSelectionChange={(e) => setSelectedSpeciesToAdd(e.value)}
                dataKey="speciesCode"
                className="overflow-hidden rounded border border-graydark/30"
              >
                <Column
                  field="imageUrl"
                  body={imageBodyTemplate}
                  style={{ minWidth: "3rem" }}
                ></Column>
                <Column
                  field="speciesCode"
                  sortable
                  style={{ minWidth: "7rem" }}
                ></Column>
                <Column
                  field="commonName"
                  sortable
                  style={{ minWidth: "7rem" }}
                ></Column>
              </DataTable>
              <Button
                disabled={selectedSpeciesToAdd == null}
                onClick={handleAddCompatibleSpecies}
              >
                Add {selectedSpeciesToAdd?.commonName}
              </Button>
            </DialogContent>
          </Dialog>
        </div>
        <div>
          {/* Delete Compatible Species */}
          <Dialog
            open={openDeleteCompatibleSpeciesDialog}
            onOpenChange={setOpenDeleteCompatibleSpeciesDialog}
          >
            <DialogTrigger>
              <Button variant={"destructive"}>Delete Compatible Species</Button>
            </DialogTrigger>
            <DialogContent className="h-3/5">
              <DialogHeader>
                <DialogTitle>Delete Compatible Species</DialogTitle>
              </DialogHeader>
              <InputText
                type="search"
                placeholder="Search..."
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  setGlobalFilter(target.value);
                }}
              />
              <DataTable
                value={compatibleSpeciesList}
                scrollable
                scrollHeight="100%"
                selection={selectedSpeciesToDelete!}
                selectionMode="single"
                globalFilter={globalFilter}
                onSelectionChange={(e) => setSelectedSpeciesToDelete(e.value)}
                dataKey="speciesCode"
                className="overflow-hidden rounded border border-graydark/30"
              >
                <Column
                  field="imageUrl"
                  body={imageBodyTemplate}
                  style={{ minWidth: "3rem" }}
                ></Column>
                <Column
                  field="speciesCode"
                  sortable
                  style={{ minWidth: "7rem" }}
                ></Column>
                <Column
                  field="commonName"
                  sortable
                  style={{ minWidth: "7rem" }}
                ></Column>
              </DataTable>
              <Button
                variant={"destructive"}
                disabled={selectedSpeciesToDelete == null}
                onClick={handleDeleteCompatibleSpecies}
              >
                Delete {selectedSpeciesToDelete?.commonName}
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card className="h-96 w-full overflow-auto">
        <CardHeader>
          <CardTitle>Compatible Species</CardTitle>
          <CardDescription>
            The following species are compatible with {curSpecies.commonName}{" "}
            and can coexist in the same habitat within the zoo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-start gap-10">
            {compatibleSpeciesList.map((species) => (
              <Card className="h-60 w-70 overflow-clip rounded-lg border-none">
                <CardContent className="relative h-full w-full p-0">
                  <img
                    src={"http://localhost:3000/" + species.imageUrl}
                    alt="Animal Image as Background"
                    className="aspect-auto h-full w-full object-cover"
                  />
                  <div className="absolute left-0 top-0 flex h-8 items-center rounded-br-md bg-whiter p-2 text-body">
                    <span className="text-md px-4 text-left font-medium">
                      {species.commonName}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SpeciesEnclosureCompatibilities;
