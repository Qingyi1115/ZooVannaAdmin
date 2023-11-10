import * as Form from "@radix-ui/react-form";
import React, { useEffect, useState } from "react";


import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, CalendarChangeEvent } from "primereact/calendar";
import { useNavigate } from "react-router-dom";
import useApiJson from "../../../hooks/useApiJson";
import { useAuthContext } from "../../../hooks/useAuthContext";
import Animal from "../../../models/Animal";
import AnimalFeedingLog from "../../../models/AnimalFeedingLog";
import FormFieldInput from "../../FormFieldInput";

interface EditAnimalFeedingLogFormProps {
  curAnimalFeedingLog: AnimalFeedingLog
}

function EditAnimalFeedingLogForm(props: EditAnimalFeedingLogFormProps) {
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();
  const [durationInMinutes, setDurationInMinutes] = useState<string>(""); // text input
  const [amountOffered, setAmountOffered] = useState<string>(""); // text input
  const [amountConsumed, setAmountConsumed] = useState<string>(""); // text input
  const [amountLeftovers, setAmountLeftovers] = useState<string>(""); // text input
  const [presentationMethod, setPresentationMethod] = useState<string>(""); // text input
  const [extraRemarks, setExtraRemarks] = useState<string>(""); // text input
  const { curAnimalFeedingLog } = props;
  const [dateTime, setDateTime] = useState<
    string | Date | Date[] | null
  >(null);
  const employee = useAuthContext().state.user?.employeeData;
  const [formError, setFormError] = useState<string | null>(null);


  const [curAnimalList, setCurAnimalList] = useState<any>(null);
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([]);

  useEffect(() => {
    apiJson.get(`http://localhost:3000/api/animal/getAllAnimals/`).then(res => {
      setCurAnimalList(res as Animal[]);
      setSelectedAnimals(res.filter((animal: Animal) => curAnimalFeedingLog.animals.map((animal: Animal) => animal.animalCode).includes(animal.animalCode)));
    });
  }, [curAnimalFeedingLog]);

  useEffect(() => {
    setDurationInMinutes(String(curAnimalFeedingLog.durationInMinutes))
    setAmountOffered(curAnimalFeedingLog.amountOffered);
    setAmountConsumed(curAnimalFeedingLog.amountConsumed);
    setAmountLeftovers(curAnimalFeedingLog.amountLeftovers);
    setPresentationMethod(curAnimalFeedingLog.presentationMethod);
    setExtraRemarks(curAnimalFeedingLog.extraRemarks);
    setDateTime(new Date(curAnimalFeedingLog.dateTime))
    console.log(curAnimalFeedingLog.animals);

  }, [curAnimalFeedingLog]);

  function validateAnimalFeedingLogName(props: ValidityState) {
    if (props != undefined) {
      if (props.valueMissing) {
        return (
          <div className="font-medium text-danger">* Please enter a value</div>
        );
      }
      // add any other cases here
    }
    return null;
  }


  // end field validations

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newAnimalFeedingLog = {
      dateTime: dateTime,
      durationInMinutes: durationInMinutes,
      amountOffered: amountOffered,
      amountConsumed: amountConsumed,
      amountLeftovers: amountLeftovers,
      presentationMethod: presentationMethod,
      extraRemarks: extraRemarks,
      // animalCodes: selectedAnimals.map((animal: Animal) => animal.animalCode)
    }
    console.log(newAnimalFeedingLog);

    try {
      const responseJson = await apiJson.put(
        `http://localhost:3000/api/animal/updateAnimalFeedingLog/${curAnimalFeedingLog.animalFeedingLogId}`,
        newAnimalFeedingLog);
      // success
      toastShadcn({
        description: "Successfully edited animal feeding log",
      });
      navigate(-1);
    } catch (error: any) {
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error has occurred while editing animal feeding log details: \n" +
          error.message,
      });
    }
    console.log(apiJson.result);
  }



  return (
    <div className="flex flex-col">

      <Form.Root
        className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        {/* Title Header and back button */}
        <div className="flex flex-col">
          <div className="mb-4 flex justify-between">
            <Button variant={"outline"} type="button" onClick={() => navigate(-1)} className="">
              Back
            </Button>
            <span className="self-center text-title-xl font-bold">
              Edit Animal Feeding Log
            </span>
            <Button disabled className="invisible">
              Back
            </Button>
          </div>
          <Separator />
          {/* <span className="mt-4 self-center text-title-xl font-bold">
            {curAnimalFeedingLog.animalFeedingLogId}
          </span> */}
        </div>

        {/* DateTime */}
        <div className="card justify-content-center block ">
          <div className="mb-1 block font-medium">Date</div>
          <Calendar id="dateTimeCalendar" showTime hourFormat="12" value={dateTime} onChange={(e: CalendarChangeEvent) => {
            if (e && e.value !== null) {
              setDateTime(e.value as Date);
            }
          }} />
        </div>

        {/* Duration in Minutes */}
        <FormFieldInput
          type="number"
          formFieldName="durationInMinutes"
          label="Duration in Minutes"
          required={true}
          placeholder=""
          value={durationInMinutes}
          setValue={setDurationInMinutes}
          validateFunction={validateAnimalFeedingLogName}
          pattern={undefined}
        />

        {/* Amount Offered */}
        <Form.Field
          name="amountOffered"
          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
        >
          <Form.Label className="font-medium">
            Amount Offered
          </Form.Label>
          <Form.Control
            asChild
            value={amountOffered}
            required={true}
            onChange={(e) => setAmountOffered(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium shadow-md outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
          >
            <textarea
              rows={6}
              placeholder="eg: 2kg beef offered to Pang Pang,... 3kg xyz offered to......."
            />
          </Form.Control>
          <Form.ValidityState>
            {validateAnimalFeedingLogName}
          </Form.ValidityState>
        </Form.Field>

        {/* Amount Consumed */}
        <Form.Field
          name="amountConsumed"
          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
        >
          <Form.Label className="font-medium">
            Amount Consumed
          </Form.Label>
          <Form.Control
            asChild
            value={amountConsumed}
            required={true}
            onChange={(e) => setAmountConsumed(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium shadow-md outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
          >
            <textarea
              rows={6}
              placeholder="eg: 2kg beef consumed by Pang Pang,... 3kg xyz consumed by..."
            />
          </Form.Control>
          <Form.ValidityState>
            {validateAnimalFeedingLogName}
          </Form.ValidityState>
        </Form.Field>

        {/* Amount Leftovers */}
        <Form.Field
          name="amountLeftovers"
          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
        >
          <Form.Label className="font-medium">
            Amount Leftovers
          </Form.Label>
          <Form.Control
            asChild
            value={amountLeftovers}
            required={true}
            onChange={(e) => setAmountLeftovers(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium shadow-md outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
          >
            <textarea
              rows={6}
              placeholder="eg: 2kg beef left over...."
            />
          </Form.Control>
          <Form.ValidityState>
            {validateAnimalFeedingLogName}
          </Form.ValidityState>
        </Form.Field>

        {/* Presentation Method */}
        <Form.Field
          name="presentationMethod"
          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
        >
          <Form.Label className="font-medium">
            Presentation Method
          </Form.Label>
          <Form.Control
            asChild
            value={presentationMethod}
            required={true}
            onChange={(e) => setPresentationMethod(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium shadow-md outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
          >
            <textarea
              rows={6}
              placeholder="Presentation methods..."
            />
          </Form.Control>
          <Form.ValidityState>
            {validateAnimalFeedingLogName}
          </Form.ValidityState>
        </Form.Field>

        {/* Extra Remarks */}
        <Form.Field
          name="extraRemarks"
          className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
        >
          <Form.Label className="font-medium">
            Extra Remarks
          </Form.Label>
          <Form.Control
            asChild
            value={extraRemarks}
            required={true}
            onChange={(e) => setExtraRemarks(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium shadow-md outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
          >
            <textarea
              rows={6}
              placeholder="Additional remarks..."
            />
          </Form.Control>
          <Form.ValidityState>
            {validateAnimalFeedingLogName}
          </Form.ValidityState>
        </Form.Field>

        {/* Animals */}
        {/* <MultiSelect
          value={selectedAnimals}
          onChange={(e: MultiSelectChangeEvent) => setSelectedAnimals(e.value)}
          options={curAnimalList}
          optionLabel="houseName"
          filter
          placeholder="Select Animals"
          className="w-full md:w-20rem" /> */}


        <Form.Submit asChild>
          <Button
            disabled={apiJson.loading}
            className="h-12 w-2/3 self-center rounded-full text-lg"
          >
            {!apiJson.loading ? (
              <div>Submit</div>
            ) : (
              <div>Loading</div>
            )}
          </Button>
        </Form.Submit>
        {formError && (
          <div className="m-2 border-danger bg-red-100 p-2">{formError}</div>
        )}

      </Form.Root>

    </div>
  );
}

export default EditAnimalFeedingLogForm;
