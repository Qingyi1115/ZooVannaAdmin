import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";

import useApiFormData from "../../../hooks/useApiFormData";
import FormFieldInput from "../../FormFieldInput";
import FormFieldSelect from "../../FormFieldSelect";
import { ContinentEnum } from "../../../enums/ContinentEnum";
import { HiCheck } from "react-icons/hi";
import { BiomeEnum } from "../../../enums/BiomeEnum";
import FormFieldRadioGroup from "../../FormFieldRadioGroup";
import { useFieldArray, useForm } from "react-hook-form";

// validation stuff
const speciesFormSchema = z.object({
  commonName: z.string().min(1).max(50, {
    message: "Common Name must be at most 50 characters.",
  }),
  scientificName: z.string().min(1).max(50),
  aliasName: z.string().min(1).max(50),
});

type SpeciesFormValues = z.infer<typeof speciesFormSchema>;
const defaultValues: Partial<SpeciesFormValues> = {
  commonName: "",
  scientificName: "",
};

function CreateNewSpeciesForm2() {
  const apiFormData = useApiFormData();

  const form = useForm<z.infer<typeof speciesFormSchema>>({
    resolver: zodResolver(speciesFormSchema),
    defaultValues: defaultValues,
  });

  //   const [speciesCode, setSpeciesCode] = useState<string>("");
  const [commonName, setCommonName] = useState<string>("");
  const [scientificName, setScientificName] = useState<string>("");
  const [aliasName, setAliasName] = useState<string>("");
  const [conservationStatus, setConservationStatus] = useState<
    string | undefined
  >(undefined); // select from set list
  const [domain, setDomain] = useState<string | undefined>(undefined);
  const [kingdom, setKingdom] = useState<string | undefined>(undefined);
  const [phylum, setPhylum] = useState<string>("");
  const [speciesClass, setSpeciesClass] = useState<string>("");
  const [order, setOrder] = useState<string>("");
  const [family, setFamily] = useState<string>("");
  const [genus, setGenus] = useState<string>("");
  const [nativeContinent, setNativeContinent] = useState<string | undefined>(
    undefined
  );
  const [selectedBiomes, setSelectedBiomes] = useState<string[] | undefined>(
    undefined
  );
  const [groupSexualDynamic, setGroupSexualDynamic] = useState<
    string | undefined
  >(undefined);
  const [habitatOrExhibit, setHabitatOrExhibit] = useState<string | undefined>(
    undefined
  );
  const [generalDietPreference, setGeneralDietPreference] = useState<
    string | undefined
  >(undefined);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formError, setFormError] = useState<string | null>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files && event.target.files[0];
    setImageFile(file);
  }

  function clearForm() {
    setCommonName("");
    setScientificName("");
    setAliasName("");
    setConservationStatus(undefined);
    setDomain(undefined);
    setKingdom(undefined);
    setPhylum("");
    setSpeciesClass("");
    setOrder("");
    setFamily("");
    setGenus("");
    setNativeContinent(undefined);
    setSelectedBiomes(undefined);
    setGroupSexualDynamic(undefined);
    setHabitatOrExhibit(undefined);
    setGeneralDietPreference(undefined);
    setImageFile(null);
  }

  function onSubmit(values: z.infer<typeof speciesFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Remember, your form must have enctype="multipart/form-data" for upload pictures
    e.preventDefault();

    const formData = new FormData();
    formData.append("commonName", commonName);
    formData.append("scientificName", scientificName);
    formData.append("aliasName", aliasName);
    formData.append("conservationStatus", conservationStatus || "");
    formData.append("domain", domain || "");
    formData.append("kingdom", kingdom || "");
    formData.append("phylum", phylum);
    formData.append("speciesClass", speciesClass);
    formData.append("order", order);
    formData.append("family", family);
    formData.append("genus", genus);
    formData.append("nativeContinent", nativeContinent || "");
    formData.append("selectedBiomes", selectedBiomes?.toString() || "");
    formData.append("groupSexualDynamic", groupSexualDynamic || "");
    formData.append("habitatOrExhibit", habitatOrExhibit || "");
    formData.append("generalDietPreference", generalDietPreference || "");
    formData.append("file", imageFile || "");
    await apiFormData.post(
      "http://localhost:3000/api/species/createnewspecies",
      formData
    );
    console.log(apiFormData.result);
    // .then((response) => {
    //   // Handle response: show a success message or redirect
    //   console.log("response submit create species");
    //   console.log(response);

    //   // Clear form fields / perform other actions upon successful ceration
    //   if (response != undefined) {
    //     clearForm();
    //   }
    // })
    // .catch((apiError) => {
    //   setFormError(apiError);
    // });
  }

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  });

  const [date2, setDate2] = React.useState<Date | undefined>(new Date());

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="border-stroke shadow-default dark:border-strokedark flex w-full flex-col gap-6 rounded-lg border bg-white p-20 text-black"
        >
          <FormField
            control={form.control}
            name="commonName"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Common Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., African Lion, Sumatran Tiger,..."
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <br />
      <div className={cn("grid gap-2")}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              {/* <CalendarIcon className="mr-2 h-4 w-4" /> */}
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Calendar
          mode="single"
          selected={date2}
          onSelect={setDate2}
          className="rounded-md border"
        />
      </div>
    </div>
  );
}

export default CreateNewSpeciesForm2;
