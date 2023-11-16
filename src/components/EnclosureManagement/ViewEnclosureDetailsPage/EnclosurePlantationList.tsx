import { useEffect, useState } from "react";
import Enclosure from "../../../models/Enclosure";
import EnclosurePlantationDatatable from "./EnclosurePlantationDatatable";

import Plantation from "../../../models/Plantation";

import useApiJson from "../../../hooks/useApiJson";

interface EnclosurePlantationListProps {
  curEnclosure: Enclosure;
}

function EnclosurePlantationList(props: EnclosurePlantationListProps) {
  const { curEnclosure } = props;

  const apiJson = useApiJson();

  const [plantationList, setPlantationList] = useState<Plantation[]>([]);
  const [refreshSeed, setRefreshSeed] = useState<number>(0);

  useEffect(() => {
    const fetchPlantations = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/enclosure/getplantationsofenclosure/${curEnclosure.enclosureId}`
        );

        setPlantationList(responseJson.plantationList as Plantation[]);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchPlantations();
  }, [refreshSeed]);

  return (
    <div>
      {/* <Button className="mb-4">Add Plantation</Button> */}
      <EnclosurePlantationDatatable
        curEnclosure={curEnclosure}
        plantationList={plantationList}
        setPlantationList={setPlantationList}
        refreshSeed={refreshSeed}
        setRefreshSeed={setRefreshSeed}
      />
    </div>
  );
}

export default EnclosurePlantationList;
