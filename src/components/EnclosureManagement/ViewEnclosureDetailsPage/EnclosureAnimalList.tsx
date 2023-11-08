import React, { useState, useEffect } from "react";
import Enclosure from "../../../models/Enclosure";
import EnclosureAnimalDatatable from "./EnclosureAnimalDatatable";

import { Button } from "@/components/ui/button";
import Animal from "../../../models/Animal";

import useApiJson from "../../../hooks/useApiJson";
import { NavLink, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface EnclosureAnimalListProps {
  curEnclosure: Enclosure;
}

function EnclosureAnimalList(props: EnclosureAnimalListProps) {
  const { curEnclosure } = props;

  const apiJson = useApiJson();

  const [animalList, setAnimalList] = useState<Animal[]>([]);
  const [refreshSeed, setRefreshSeed] = useState<number>(0);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/enclosure/getanimalsofenclosure/${curEnclosure.enclosureId}`
        );
        const animalListNoDeceasedOrReleased = (
          responseJson.animalsList as Animal[]
        ).filter((animal) => {
          let statuses = animal.animalStatus.split(",");
          return !(
            statuses.includes("DECEASED") || statuses.includes("RELEASED")
          );
        });
        setAnimalList(animalListNoDeceasedOrReleased);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchAnimals();
  }, [refreshSeed]);

  return (
    <div>
      <Button>Add Animal</Button>
      <EnclosureAnimalDatatable
        curEnclosure={curEnclosure}
        animalList={animalList}
        setAnimalList={setAnimalList}
      />
    </div>
  );
}

export default EnclosureAnimalList;
