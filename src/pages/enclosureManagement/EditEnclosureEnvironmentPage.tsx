import { useState } from "react";
import EditEnclosureEnvironmentForm from "../../components/EnclosureManagement/ViewEnclosureDetailsPage/EditEnclosureEnvironmentForm";
import useApiJson from "../../hooks/useApiJson";
import { useEnclosureContext } from "../../hooks/useEnclosureContext";

function EditEnclosureEnvironmentPage() {

  const apiJson = useApiJson();

  const [refreshSeed, setRefreshSeed] = useState<number>(0);
  const { state, dispatch } = useEnclosureContext();
  const curEnclosure = state.curEnclosure;

  console.log("current enclosure: ", curEnclosure);
  return (
    <div className="p-10">
      <EditEnclosureEnvironmentForm curEnclosure={curEnclosure} refreshSeed={refreshSeed} setRefreshSeed={setRefreshSeed} />
    </div>
  );
}

export default EditEnclosureEnvironmentPage;
