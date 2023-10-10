import React, { useState, useEffect } from "react";
import { useParams } from "react-router";

import AnimalActivity from "../../../models/AnimalActivity";
import Animal from "../../../models/Animal";
import Species from "../../../models/Species";
import EnrichmentItem from "../../../models/EnrichmentItem";

import * as Form from "@radix-ui/react-form";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as Checkbox from "@radix-ui/react-checkbox";

import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";

import useApiFormData from "../../../hooks/useApiFormData";
import { HiCheck } from "react-icons/hi";

import useApiJson from "../../../hooks/useApiJson";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { NavLink } from "react-router-dom";
import {
  AcquisitionMethod,
  AnimalGrowthStage,
  AnimalSex,
  AnimalStatusType,
  IdentifierType,
} from "../../../enums/Enumurated";
import { Calendar, CalendarChangeEvent } from "primereact/calendar";

import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";

import { PickList } from "primereact/picklist";

interface AddAnimalToActivityFormProps {
  curAnimalActivity: AnimalActivity;
}

function AddAnimalToActivityForm(props: AddAnimalToActivityFormProps) {
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;

  const { curAnimalActivity } = props;
  const animalActivityId = curAnimalActivity.animalActivityId;

  // const
  const [animalSourceList, setAnimalSourceList] = useState<Animal[]>([]);

  const [animalTargetList, setAnimalTargetList] = useState<Animal[]>(
    curAnimalActivity.animals || []
  );
  const targetAnimalCodesSet = curAnimalActivity.animals
    ? new Set(curAnimalActivity.animals.map((animal) => animal.animalCode))
    : new Set();

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const responseJson = await apiJson.get(
          "http://localhost:3000/api/animal/getAllAnimals"
        );
        // Also no DECEASED or RELEASED
        const animalListNotAlreadyInvolved = (responseJson as Animal[])
          .filter((animal) => !targetAnimalCodesSet.has(animal.animalCode))
          .filter((animal) => {
            let statuses = animal.animalStatus.split(",");
            return !(
              statuses.includes("DECEASED") || statuses.includes("RELEASED")
            );
          });
        setAnimalSourceList(animalListNotAlreadyInvolved);
        // repopulate target list to include species details
        // Also no DECEASED or RELEASED
        const animalListAlreadyInvolved = (responseJson as Animal[])
          .filter((animal) => targetAnimalCodesSet.has(animal.animalCode))
          .filter((animal) => {
            let statuses = animal.animalStatus.split(",");
            return !(
              statuses.includes("DECEASED") || statuses.includes("RELEASED")
            );
          });
        setAnimalTargetList(animalListAlreadyInvolved);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchAnimals();
  }, []);

  // validation??
  function validateSelectedItem(props: ValidityState) {
    // console.log(props);
    if (props != undefined) {
      if (animalTargetList.length == 0) {
        return (
          <div className="font-medium text-danger">
            * Please select at least one item
          </div>
        );
      }
      // add any other cases here
    }
    return null;
  }
  //
  const animalItemTemplate = (animal: Animal) => {
    return (
      <div className="flex flex-wrap items-center gap-3 p-2">
        <img
          className="aspect-square h-12 w-12 rounded-full border border-white object-cover shadow-4"
          src={`http://localhost:3000/${animal.imageUrl}`}
          alt={animal.houseName}
        />
        <div className="flex flex-1 flex-col justify-center gap-1">
          <div className="font-bold">
            {animal.houseName} -{" "}
            <span className="text-sm">{animal.species?.commonName}</span>{" "}
            {targetAnimalCodesSet.has(animal.animalCode) && (
              <span className="font-medium text-body">(Already included)</span>
            )}
          </div>
          <div className="flex flex-col items-start gap-1">
            <span>{animal.animalCode}</span>
          </div>
        </div>
        {/* <span className="font-bold text-900">${item.price}</span> */}
      </div>
    );
  };

  const onChange = (event: any) => {
    setAnimalSourceList(event.source);
    setAnimalTargetList(event.target);
  };

  //
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const animalCodes = animalTargetList.map((animal) => animal.animalCode);

    let assignAnimalsBody = {
      animalActivityId,
      animalCodes,
    };

    const assignAnimalsToAnimalActivityApi = async () => {
      try {
        const response = await apiJson.put(
          "http://localhost:3000/api/animal/assignAnimalsToActivity",
          assignAnimalsBody
        );
        // success
        toastShadcn({
          description: "Successfully added animal(s) to event",
        });
        const redirectUrl = `/animal/viewanimalactivitydetails/${curAnimalActivity.animalActivityId}`;
        navigate(redirectUrl);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while adding animal(s) to event: \n" +
            error.message,
        });
      }
    };
    assignAnimalsToAnimalActivityApi();
  }

  return (
    <div>
      <Form.Root
        className="flex w-full flex-col gap-6 rounded-lg bg-white text-black"
        onSubmit={handleSubmit}
      >
        <Form.Field
          name="speciesImage"
          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
        >
          <Form.Label className="m-4 self-center text-center text-lg font-medium">
            Select one or more animals to be added to the activity. <br />
            Hold the Control/Shift keys and click to select multiple
          </Form.Label>
          <Form.Control
            className="hidden"
            type="text"
            value={animalTargetList.toString()}
            required={true}
            onChange={() => null}
          ></Form.Control>
          <PickList
            source={animalSourceList}
            target={animalTargetList}
            onChange={onChange}
            itemTemplate={animalItemTemplate}
            filter
            filterBy="houseName,species.commonName"
            breakpoint="1400px"
            sourceHeader="Available"
            targetHeader="Selected (Initialised with already involved animals)"
            sourceStyle={{ height: "24rem" }}
            targetStyle={{ height: "24rem" }}
            sourceFilterPlaceholder="Search by name or species name"
            targetFilterPlaceholder="Search by name or species name"
          />
          <div className="self-center">
            <Form.ValidityState>{validateSelectedItem}</Form.ValidityState>
          </div>
        </Form.Field>

        <Form.Submit asChild>
          <Button
            disabled={apiJson.loading}
            className="h-12 w-2/3 self-center rounded-full text-lg"
          >
            {!apiJson.loading ? <div>Submit</div> : <div>Loading</div>}
          </Button>
        </Form.Submit>
        <div className="self-center text-center">
          The animals inside the right column will be added to the activity if
          they had not already been added
          <br />
          <span className="text-center font-medium text-danger">
            Animals already involved but moved to the left column will{" "}
            <span className="font-bold">NOT</span> be removed
          </span>
        </div>
      </Form.Root>
    </div>
  );
}

export default AddAnimalToActivityForm;
