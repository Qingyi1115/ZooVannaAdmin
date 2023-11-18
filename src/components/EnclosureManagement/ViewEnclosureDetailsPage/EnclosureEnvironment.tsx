import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { HiPencil } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import beautifyText from "../../../hooks/beautifyText";
import useApiJson from "../../../hooks/useApiJson";
import { useAuthContext } from "../../../hooks/useAuthContext";
import Enclosure from "../../../models/Enclosure";
import { Table, TableBody, TableCell, TableRow } from "../../../shadcn/components/ui/table";
import EnclosureSensorCard from "./EnclosureSensorCard";

interface EnclosureEnvironmentProps {
  curEnclosure: Enclosure;
}

function EnclosureEnvironment(
  props: EnclosureEnvironmentProps
) {
  const { curEnclosure } = props;
  const navigate = useNavigate();
  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;
  const [dataList, setDataList] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const employee = useAuthContext().state.user?.employeeData;
  useEffect(() => {

    //Implementing the setInterval method 
    const interval = setInterval(() => {
      setCount(count + 1);
    }, 5000);

    //Clearing the interval 
    return () => clearInterval(interval);
  }, [count]);

  useEffect(() => {

    apiJson.get(
      `http://localhost:3000/api/enclosure/getEnvironmentSensorsData/${curEnclosure.enclosureId}`
    ).then(res => {
      console.log("EnclosureEnvironment", res)
      const sensorData: any = [];
      for (const dat of res.environmentData) {
        sensorData.push({
          values: dat.sensorReadings.map(val => val.value),
          labels: dat.sensorReadings.map(val => new Date(val.readingDate).toLocaleTimeString().substring(0, 5)),
          unit: dat.sensorType == "TEMPERATURE" ? "°C" :
            dat.sensorType == "LIGHT" ? "lx" :
              dat.sensorType == "CAMERA" ? "approx. pax" :
                dat.sensorType == "HUMIDITY" ? "RH" : "",
          type: beautifyText(dat.sensorType),
          name: dat.sensorName
        })
      }
      setDataList(sensorData);
    }).catch(err => console.log(err));
  }, [curEnclosure, count])

  return (
    <div>
      {curEnclosure && (
        <div className="my-4 flex justify-start gap-6">
          <Button
            onClick={() =>
              navigate(
                `/assetfacility/viewfacilitydetails/${curEnclosure.facility?.facilityId}/hubs`
              )
            }
            type="button"
            className=""
          >
            Manage Hub and Sensor Details
          </Button>
          {(employee.superAdmin ||
            employee.planningStaff?.plannerType == "OPERATIONS_MANAGER") && (
              <Button
                className="mr-2"
                onClick={() => {
                  navigate(
                    `/enclosure/viewenclosuredetails/${curEnclosure.enclosureId}/environment`,
                    { replace: true }
                  );
                  navigate(
                    `/enclosure/editenclosureenvironment/${curEnclosure.enclosureId}`
                  );
                }}
              >
                <HiPencil className="mx-auto"></HiPencil>
                Edit Environment Details
              </Button>
            )}
        </div>
      )}
      <br />
      <div className="text-lg font-bold">Acceptable Condition Ranges</div>
      <Table className="rounded-lg shadow-lg">
        <TableBody>
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
        </TableBody>
      </Table>
      <br />
      {dataList.length == 0 ?
        <div>No Sensor Readings</div>
        :
        dataList.map(val => {
          return <EnclosureSensorCard
            unit={val.unit}
            type={val.type}
            labels={val.labels}
            values={val.values}
            name={val.name}
          ></EnclosureSensorCard>
        })
      }

    </div>
  );
}

export default EnclosureEnvironment;
