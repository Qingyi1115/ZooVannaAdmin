import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EditEnclosureSafetyForm from "../../components/EnclosureManagement/ViewEnclosureDetailsPage/EditEnclosureSafetyForm";
import useApiJson from "../../hooks/useApiJson";
import Enclosure from "../../models/Enclosure";

function EditEnclosureSafetyPage() {

  const apiJson = useApiJson();
  const { enclosureId } = useParams<string>();
  const [curEnclosure, setCurEnclosure] = useState<Enclosure>({} as any);

  useEffect(() => {

    apiJson.get(
      `http://localhost:3000/api/enclosure/getEnclosureById/${enclosureId}`
    ).then(res => {
      console.log("EditEnclosureSafetyPage", res);
      setCurEnclosure(res);
    }).catch(err => console.log(err));
  }, [enclosureId])

  return (
    <div className="p-10">
      {curEnclosure.enclosureId && curEnclosure.enclosureId != -1 && <EditEnclosureSafetyForm curEnclosure={curEnclosure} />}
    </div>
  );
}

export default EditEnclosureSafetyPage;
