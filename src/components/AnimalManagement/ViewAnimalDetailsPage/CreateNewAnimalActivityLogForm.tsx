import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import * as Form from "@radix-ui/react-form";
import { Calendar, CalendarChangeEvent } from "primereact/calendar";
import { useNavigate } from "react-router-dom";
import beautifyText from "../../../hooks/beautifyText";
import useApiJson from "../../../hooks/useApiJson";
import { useAuthContext } from "../../../hooks/useAuthContext";
import Animal from "../../../models/Animal";
import AnimalActivity from "../../../models/AnimalActivity";
import FormFieldInput from "../../FormFieldInput";
import FormFieldSelect from "../../FormFieldSelect";

interface CreateNewAnimalActivityLogProps {
  curAnimalActivity: AnimalActivity
}

function validateAnimalActivityLogName(props: ValidityState) {
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

function CreateNewAnimalActivityLogForm(props: CreateNewAnimalActivityLogProps) {
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;
  const navigate = useNavigate();
  const { curAnimalActivity } = props;
  const [activityType, setActivityType] = useState<string | undefined>(
    curAnimalActivity.activityType); // dropdown
  const [durationInMinutes, setDurationInMinutes] = useState<string>(""); // text input
  const [sessionRating, setSessionRating] = useState<string | undefined>(
    undefined); // dropdown
  const [details, setDetails] = useState<string>(""); // text input
  const [animalReaction, setAnimalReaction] = useState<string | undefined>(undefined); // text input
  const [dateTime, setDateTime] = useState<Date | null>(null);
  const employee = useAuthContext().state.user?.employeeData;
  const [formError, setFormError] = useState<string | null>(null);


  const [curAnimalList, setCurAnimalList] = useState<any>(null);
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([]);

  useEffect(() => {
    if (curAnimalActivity.animals != undefined && curAnimalActivity.animals?.length > 0) {
      setCurAnimalList(curAnimalActivity.animals)
    } else {
      apiJson.get(`http://localhost:3000/api/animal/getAllAnimals/`).then(res => {
        setCurAnimalList(res as Animal[]);
        console.log(res);
      });
    }
  }, []);

  async function handleSubmit(e: any) {
    // Remember, your form must have enctype="multipart/form-data" for upload pictures
    e.preventDefault();
    const newAnimalActivity = {
      animalActivityId: curAnimalActivity.animalActivityId,
      activityType: activityType,
      dateTime: dateTime?.getTime(),
      durationInMinutes: durationInMinutes,
      sessionRating: sessionRating,
      animalReaction: animalReaction,
      details: details,
      animalCodes: selectedAnimals.map((animal: Animal) => animal.animalCode)
    }
    console.log(newAnimalActivity);

    try {
      const responseJson = await apiJson.post(
        `http://localhost:3000/api/animal/createAnimalActivityLog/`,
        newAnimalActivity);
      // success
      toastShadcn({
        description: "Successfully created animal activity log",
      });
      navigate(-1);
    } catch (error: any) {
      toastShadcn({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "An error has occurred while creating animal activity log details: \n" +
          error.message,
      });
    }
    console.log(apiJson.result);

    // handle success case or failurecase using apiJson
  }

  return (
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
            Create Animal Activity Log
          </span>
          <Button disabled className="invisible">
            Back
          </Button>
        </div>
        <Separator />
      </div>
      {/* Activity Type */}
      <div className="mb-1 block font-medium">
        Activity Type<br /> <b>{beautifyText(activityType)}</b>
      </div>
      {/* <FormFieldSelect
        formFieldName="activityType"
        label="Activity Type"
        required={true}
        placeholder="Select an activity type..."
        valueLabelPair={[
          ["TRAINING", "Training"],
          ["ENRICHMENT", "Enrichment"],
          // ["OBSERVATION", "Observation"]
        ]}
        value={activityType}
        setValue={setActivityType}
        validateFunction={validateAnimalActivityLogName}
      /> */}
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
        validateFunction={validateAnimalActivityLogName}
        pattern={undefined}
      />

      {/* Session Rating */}
      <FormFieldSelect
        formFieldName="sessionRating"
        label="Session Rating"
        required={true}
        placeholder="Select a rating..."
        valueLabelPair={[
          ["EXCELLENT", "Excellent"],
          ["GOOD", "Good"],
          ["FAIR", "Fair"],
          ["POOR", "Poor"],
          ["NOT_RECORDED", "Not Recorded"]
        ]}
        value={sessionRating}
        setValue={setSessionRating}
        validateFunction={validateAnimalActivityLogName}
      />
      {/* Animal Reaction */}
      <FormFieldSelect
        formFieldName="animalReaction"
        label="Animal Reaction"
        required={true}
        placeholder="Select a reaction"
        valueLabelPair={[
          ["POSITIVE_RESPONSE", "Positive Response"],
          ["RESPONSIVE", "Responsive"],
          ["ENTHUSIASTIC", "Enthusiastic"],
          ["ENGAGED", "Engaged"],
          ["PLAYFUL", "Playful"],
          ["CONTENT", "Content"],
          ["NEUTRAL_RESPONSE", "Neutral Response"],
          ["OBSERVANT", "Observant"],
          ["CAUTIOUS", "Cautious"],
          ["NEGATIVE_RESPONSE", "Negative Response"],
          ["STRESSED", "Stressed"],
          ["AVOIDANT", "Avoidant"],
          ["RESISTANT", "Resistant"],
          ["AGGRESSIVE", "Aggressive"],
          ["FEARFUL", "Fearful"],
          ["OTHER_RESPONSE", "Other Response"],
          ["ENERGETIC", "Energetic"],
          ["RELAXED", "Relaxed"],
          ["INDETERMINATE", "Indeterminate"],
          ["UNDETERMINED", "Undetermined"],
        ]}
        value={animalReaction}
        setValue={setAnimalReaction}
        validateFunction={validateAnimalActivityLogName}
      />

      {/* Details */}
      <Form.Field
        name="details"
        className="flex w-full flex-col gap-1 data-[invalid]:text-danger"
      >
        <Form.Label className="font-medium">
          Details
        </Form.Label>
        <Form.Control
          asChild
          value={details}
          required={true}
          onChange={(e) => setDetails(e.target.value)}
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium shadow-md outline-none transition hover:bg-whiten focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
        >
          <textarea
            rows={6}
            placeholder="Activity details..."
          />
        </Form.Control>
        <Form.ValidityState>
          {validateAnimalActivityLogName}
        </Form.ValidityState>
      </Form.Field>

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
  );
}

export default CreateNewAnimalActivityLogForm;
