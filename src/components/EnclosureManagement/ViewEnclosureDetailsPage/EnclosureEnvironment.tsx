import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import beautifyText from "../../../hooks/beautifyText";
import useApiJson from "../../../hooks/useApiJson";
import Enclosure from "../../../models/Enclosure";
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
      console.log("aa", sensorData)
      setDataList(sensorData);
    }).catch(err => console.log(err));
  }, [curEnclosure])

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
            Manage Hub and Sensor Details
          </Button>

        </div>
      )}
      {
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
