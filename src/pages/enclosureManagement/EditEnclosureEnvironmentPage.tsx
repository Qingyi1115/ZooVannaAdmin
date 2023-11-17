import { useEffect, useState } from "react";
import EditEnclosureEnvironmentForm from "../../components/EnclosureManagement/ViewEnclosureDetailsPage/EditEnclosureEnvironmentForm";
import useApiJson from "../../hooks/useApiJson";
import { useEnclosureContext } from "../../hooks/useEnclosureContext";
import { useParams } from "react-router-dom";
import Enclosure from "../../models/Enclosure";

function EditEnclosureEnvironmentPage() {

  const apiJson = useApiJson();
  const { enclosureId } = useParams<string>();
  const [curEnclosure, setCurEnclosure] = useState<Enclosure>({} as any);

  useEffect(() => {
    
    apiJson.get(
      `http://localhost:3000/api/enclosure/getEnclosureById/${enclosureId}`
    ).then(res => {
      console.log("EditEnclosureEnvironmentPage", res);
      setCurEnclosure(res);
    }).catch(err=>console.log(err));
  },[enclosureId])

  return (
    <div className="p-10">
      {curEnclosure.enclosureId && curEnclosure.enclosureId != -1 && <EditEnclosureEnvironmentForm curEnclosure={curEnclosure} />}
    </div>
  );
}

export default EditEnclosureEnvironmentPage;
