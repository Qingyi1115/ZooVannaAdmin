import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import useApiJson from "../../../hooks/useApiJson";
import Enclosure from "../../../models/Enclosure";
import EnclosurePlantationList from "./EnclosurePlantationList";

interface EnclosureEnvironmentProps {
  curEnclosure: Enclosure;
}

// const emptyEnclosure: Enclosure = {
//     enclosureId: 0,
//     name: "",
//     remark: "",
//     length: 0,
//     width: 0,
//     height: 0,
//     enclosureStatus: EnclosureStatus.CLOSED,
//     designDiagramJsonUrl: "" ,
//     longGrassPercent: 0 ,
//     shortGrassPercent: 0 ,
//     rockPercent: 0 ,
//     sandPercent: 0 ,
//     snowPercent: 0 ,
//     soilPercent: 0 ,
//     landArea: 0 ,
//     waterArea: 0 ,
//     plantationCoveragePercent: 0 ,
//     acceptableTempMin: 0 ,
//     acceptableTempMax: 0 ,
//     acceptableHumidityMin: 0 ,
//     acceptableHumidityMax: 0 ,
// };

function EnclosureEnvironment(
  props: EnclosureEnvironmentProps
) {
  const { curEnclosure } = props;
  const navigate = useNavigate();
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;


  return (
    <div>
      {curEnclosure && (
        <div >
          <Button
            onClick={() =>
              navigate(
                `/enclosure/editenclosurenvironment/${curEnclosure.enclosureId}`
              )
            }

            className=""
          >
            Edit Enclosure Environment Details
          </Button>
          <br />
          <EnclosurePlantationList curEnclosure={curEnclosure} />
        </div>
      )}
      {/* <Dialog
        visible={deleteEnclosureReqDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteSpeciesDialogFooter}
        onHide={hideDeleteEnclosureReqDialog}
      >
        <div className="confirmation-content">
          <i className="" />
          {curEnclosure && (
            <span>
              Are you sure you want to delete the current enclosure
              requirements?
            </span>
          )}
        </div>
      </Dialog> */}
    </div>
  );
}

export default EnclosureEnvironment;
