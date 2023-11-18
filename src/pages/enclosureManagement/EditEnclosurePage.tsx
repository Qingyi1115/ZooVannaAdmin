import { useState } from "react";
import EditEnclosureForm from "../../components/EnclosureManagement/EditEnclosureForm";
import useApiJson from "../../hooks/useApiJson";
import { useEnclosureContext } from "../../hooks/useEnclosureContext";

function EditEnclosurePage() {

  const apiJson = useApiJson();

  const [refreshSeed, setRefreshSeed] = useState<number>(0);
  const { state, dispatch } = useEnclosureContext();
  const curEnclosure = state.curEnclosure;

  console.log("current enclosure: ", curEnclosure);
  return (
    <div className="p-10">
      <EditEnclosureForm curEnclosure={curEnclosure} refreshSeed={refreshSeed} setRefreshSeed={setRefreshSeed} />
    </div>
  );
}

export default EditEnclosurePage;
