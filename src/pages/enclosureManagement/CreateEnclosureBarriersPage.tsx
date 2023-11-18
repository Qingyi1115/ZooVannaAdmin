import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useApiJson from "../../hooks/useApiJson";
import Enclosure from "../../models/Enclosure";
import CreateEnclosureBarriersForm from "../../components/EnclosureManagement/CreateEnclosureBarriersPage/CreateEnclosureBarriersForm";

function CreateEnclosureBarriersPage() {
  const apiJson = useApiJson();
  const { enclosureId } = useParams<string>();
  const [curEnclosure, setCurEnclosure] = useState<Enclosure>({} as any);

  useEffect(() => {
    apiJson
      .get(
        `http://localhost:3000/api/enclosure/getEnclosureById/${enclosureId}`
      )
      .then((res) => {
        // console.log("EditEnclosureSafetyPage", res);
        setCurEnclosure(res);
      })
      .catch((err) => console.log(err));
  }, [enclosureId]);

  return (
    <div className="overflow-y-scroll  p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-lg">
        {curEnclosure && (
          <CreateEnclosureBarriersForm curEnclosure={curEnclosure} />
        )}
      </div>
    </div>
  );
}

export default CreateEnclosureBarriersPage;
