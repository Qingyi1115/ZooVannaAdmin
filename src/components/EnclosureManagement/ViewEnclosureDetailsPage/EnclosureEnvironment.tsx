import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableRow
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { TwoThumbSliderWithNumber } from "../../../components/SpeciesManagement/TwoThumbSliderWithNumber";
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
          <Table className="rounded-lg shadow-lg">
            <TableBody>

              <TableRow>
                <TableCell className="w-1/3 font-bold" colSpan={2}>
                  <span className="text-amber-600">Land Area</span> (m
                  <sup>2</sup>)
                </TableCell>
                <TableCell>{curEnclosure.landArea}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-1/3 font-bold" colSpan={2}>
                  <span className="text-blue-600">Water Area</span> (m
                  <sup>2</sup>)
                </TableCell>
                <TableCell>{curEnclosure.waterArea}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-1/3 font-bold" colSpan={2}>
                  Temperature Range (&deg;C)
                </TableCell>
                <TableCell>
                  <span className="font-bold">
                    {curEnclosure.acceptableTempMin}
                  </span>{" "}
                  &deg;C —{" "}
                  <span className="font-bold">
                    {curEnclosure.acceptableTempMax}
                  </span>{" "}
                  &deg;C
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-1/3 font-bold" colSpan={2}>
                  Humidity Range (g.m<sup>-3</sup>)
                </TableCell>
                <TableCell>
                  <span className="font-bold">
                    {curEnclosure.acceptableHumidityMin}
                  </span>{" "}
                  g.m<sup>-3</sup> —{" "}
                  <span className="font-bold">
                    {curEnclosure.acceptableHumidityMax}
                  </span>{" "}
                  g.m
                  <sup>-3</sup>
                </TableCell>
              </TableRow>
              {/* <TableRow>
                <TableCell className="w-1/3 font-bold" colSpan={2}>
                  Receommended Stand-off Barrier Distance (m)
                </TableCell>
                <TableCell>
                  {curEnclosure.recommendedStandOffBarrierDistMetres}
                </TableCell>
              </TableRow> */}
              <TableRow>
                <TableCell className="w-1/3 font-bold" colSpan={2}>
                  Plantation Coverage (%)
                </TableCell>
                <TableCell>
                  <TwoThumbSliderWithNumber
                    value={[
                      curEnclosure.plantationCoveragePercent || 0,
                      curEnclosure.plantationCoveragePercent || 0,
                    ]}
                    min={0}
                    max={100}
                    minStepsBetweenThumbs={1}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-1/5 font-bold" rowSpan={7}>
                  Terrain Distribution (%)
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-1/6 font-bold">
                  <div className="flex items-center gap-2">
                    <img
                      src="../../../../src/assets/terrain/long-grass.jpg"
                      className="aspect-square h-6 w-6 rounded-full"
                    />
                    <span>Long Grass</span>
                  </div>
                </TableCell>
                <TableCell>
                  <TwoThumbSliderWithNumber
                    value={[
                      curEnclosure.longGrassPercent || 0,
                      curEnclosure.longGrassPercent || 0,
                    ]}
                    min={0}
                    max={100}
                    minStepsBetweenThumbs={1}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-1/6 font-bold">
                  <div className="flex items-center gap-2">
                    <img
                      src="../../../../src/assets/terrain/short-grass.jpg"
                      className="aspect-square h-6 w-6 rounded-full"
                    />
                    <span>Short Grass</span>
                  </div>
                </TableCell>
                <TableCell>
                  <TwoThumbSliderWithNumber
                    value={[
                      curEnclosure.shortGrassPercent || 0,
                      curEnclosure.shortGrassPercent || 0,
                    ]}
                    min={0}
                    max={100}
                    minStepsBetweenThumbs={1}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-1/6 font-bold">
                  <div className="flex items-center gap-2">
                    <img
                      src="../../../../src/assets/terrain/soil.jpg"
                      className="aspect-square h-6 w-6 rounded-full"
                    />
                    <span>Soil</span>
                  </div>
                </TableCell>
                <TableCell>
                  <TwoThumbSliderWithNumber
                    value={[
                      curEnclosure.soilPercent || 0,
                      curEnclosure.soilPercent || 0,
                    ]}
                    min={0}
                    max={100}
                    minStepsBetweenThumbs={1}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-1/6 font-bold">
                  <div className="flex items-center gap-2">
                    <img
                      src="../../../../src/assets/terrain/rock.jpg"
                      className="aspect-square h-6 w-6 rounded-full"
                    />
                    <span>Rock</span>
                  </div>
                </TableCell>
                <TableCell>
                  <TwoThumbSliderWithNumber
                    value={[
                      curEnclosure.rockPercent || 0,
                      curEnclosure.rockPercent || 0,
                    ]}
                    min={0}
                    max={100}
                    minStepsBetweenThumbs={1}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-1/6 font-bold">
                  <div className="flex items-center gap-2">
                    <img
                      src="../../../../src/assets/terrain/sand.jpg"
                      className="aspect-square h-6 w-6 rounded-full"
                    />
                    <span>Sand</span>
                  </div>
                </TableCell>
                <TableCell>
                  <TwoThumbSliderWithNumber
                    value={[
                      curEnclosure.sandPercent || 0,
                      curEnclosure.sandPercent || 0,
                    ]}
                    min={0}
                    max={100}
                    minStepsBetweenThumbs={1}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-1/6 font-bold">
                  <div className="flex items-center gap-2">
                    <img
                      src="../../../../src/assets/terrain/snow.jpg"
                      className="aspect-square h-6 w-6 rounded-full"
                    />
                    <span>Snow</span>
                  </div>
                </TableCell>
                <TableCell>
                  <TwoThumbSliderWithNumber
                    value={[
                      curEnclosure.snowPercent || 0,
                      curEnclosure.snowPercent || 0,
                    ]}
                    min={0}
                    max={100}
                    minStepsBetweenThumbs={1}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
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
