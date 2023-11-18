import Enclosure from "../../../models/Enclosure";

import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { HiPencil } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import useApiJson from "../../../hooks/useApiJson";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { TwoThumbSliderWithNumber } from "../../SpeciesManagement/TwoThumbSliderWithNumber";
import EnclosurePlantationList from "./EnclosurePlantationList";

interface EnclosureLayoutDesignProps {
  curEnclosure: Enclosure;
}
function EnclosureLayoutDesign(props: EnclosureLayoutDesignProps) {
  const { curEnclosure } = props;

  const apiJson = useApiJson();
  const navigate = useNavigate();
  const employee = useAuthContext().state.user?.employeeData;

  return (
    <div>
      <div className="flex justify-center">
        <Button
          onClick={() =>
            navigate(`/enclosure/viewenclosuredetails/enclosuredesigndiagram/`)
          }
          className="w-1/2 text-lg"
        >
          View Design Diagram
        </Button>
      </div>
      <Separator className="my-4" />
      {(employee.superAdmin ||
        employee.planningStaff?.plannerType == "OPERATIONS_MANAGER") && (
        <Button
          className="mr-2"
          onClick={() => {
            navigate(
              `/enclosure/viewenclosuredetails/${curEnclosure.enclosureId}/layoutdesign`,
              { replace: true }
            );
            navigate(
              `/enclosure/editenclosureterrain/${curEnclosure.enclosureId}`
            );
          }}
        >
          <HiPencil className="mr-2"></HiPencil>
          Edit Requirements
        </Button>
      )}
      <Table className="rounded-lg shadow-lg">
        <TableBody>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              <span className="text-amber-600">Land Area</span> (m
              <sup>2</sup>)
            </TableCell>
            <TableCell>
              {curEnclosure.landArea || "Please set enclosure Diagram"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              <span className="text-blue-600">Water Area</span> (m
              <sup>2</sup>)
            </TableCell>
            <TableCell>
              {curEnclosure.waterArea || "Please set enclosure Diagram"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-1/3 font-bold" colSpan={2}>
              Plantation Coverage (%)
            </TableCell>
            <TableCell>
              <TwoThumbSliderWithNumber
                value={[
                  curEnclosure.plantationCoveragePercent
                    ? +Number(curEnclosure.plantationCoveragePercent).toFixed(1)
                    : 0,
                  curEnclosure.plantationCoveragePercent
                    ? +Number(curEnclosure.plantationCoveragePercent).toFixed(1)
                    : 0,
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
  );
}

export default EnclosureLayoutDesign;
