import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EditEnclosureTerrainForm from "../../components/EnclosureManagement/ViewEnclosureDetailsPage/EditEnclosureTerrainForm";
import useApiJson from "../../hooks/useApiJson";
import Enclosure from "../../models/Enclosure";

function EditEnclosureTerrainPage() {

  const apiJson = useApiJson();
  const { enclosureId } = useParams<string>();
  const [curEnclosure, setCurEnclosure] = useState<Enclosure>({} as any);

  useEffect(() => {

    apiJson.get(
      `http://localhost:3000/api/enclosure/getEnclosureById/${enclosureId}`
    ).then(res => {
      console.log("EditEnclosureTerrainPage", res);
      setCurEnclosure(res);
    }).catch(err => console.log(err));
  }, [enclosureId])

  return (
    <div className="p-10">
      {curEnclosure.enclosureId && curEnclosure.enclosureId != -1 && <EditEnclosureTerrainForm curEnclosure={curEnclosure} />}
    </div>
  );
}

export default EditEnclosureTerrainPage;
