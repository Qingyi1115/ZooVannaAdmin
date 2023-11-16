import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EditEnclosureForm from "../../components/EnclosureManagement/EditEnclosureForm";
import useApiJson from "../../hooks/useApiJson";
import Enclosure from "../../models/Enclosure";

function EditEnclosurePage() {

  const apiJson = useApiJson();

  const { enclosureId } = useParams<{ enclosureId: string }>();
  const [curEnclosure, setCurEnclosure] =
    useState<Enclosure | null>(null);
  const [refreshSeed, setRefreshSeed] = useState<number>(0);

  useEffect(() => {
    const fetchEnclosure = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/enclosure/getEnclosureById/${enclosureId}`
        );
        setCurEnclosure(responseJson["enclosure"] as Enclosure);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchEnclosure();
  }, [refreshSeed]);

  return (
    <div className="p-10">
      <EditEnclosureForm curEnclosure={curEnclosure} refreshSeed={refreshSeed} setRefreshSeed={setRefreshSeed} />
    </div>
  );
}

export default EditEnclosurePage;
