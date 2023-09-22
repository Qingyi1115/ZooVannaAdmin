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

import EnclosureCapabilitiesTable from "./EnclosureCapabilitiesTable";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

interface SpeciesEnclosureCompatibilitiesProps {
  curSpecies: Species;
}

function SpeciesEnclosureCompatibilities(
  props: SpeciesEnclosureCompatibilitiesProps
) {
  const { curSpecies } = props;
  const apiJson = useApiJson();

  const [compatibleSpeciesList, setCompatibleSpeciesList] = useState<Species[]>(
    []
  );

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
  }, []);

  return (
    <div className="my-4 flex flex-col items-start gap-4">
      <div>
        <Button>Add Compatible Species</Button>
      </div>
      <Card className="h-1/2 w-full">
        <CardHeader>
          <CardTitle>Compatible Species</CardTitle>
          <CardDescription>
            The following species are compatible with {curSpecies.commonName}{" "}
            and can coexist in the same habitat within the zoo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-start gap-10">
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
