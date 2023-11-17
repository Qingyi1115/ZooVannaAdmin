import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import useApiJson from "../../../hooks/useApiJson";
import Enclosure from "../../../models/Enclosure";
import { useEffect, useState } from "react";
import EnclosureSensorCard from "./EnclosureSensorCard";
import beautifyText from "../../../hooks/beautifyText";

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

  useEffect(() => { 

      //Implementing the setInterval method 
      const interval = setInterval(() => { 
        setCount(count + 1); 
      }, 5000); 

      //Clearing the interval 
      return () => clearInterval(interval); 
  }, [count]); 

  useEffect(()=>{

    apiJson.get(
      `http://localhost:3000/api/enclosure/getEnvironmentSensorsData/${curEnclosure.enclosureId}`
    ).then(res=>{
      const sensorData : any = [];
      for (const dat of res.environmentData) {
        sensorData.push({
          values: dat.sensorReadings.map(val => val.value),
          labels: dat.sensorReadings.map(val => new Date(val.readingDate).toLocaleTimeString().substring(0, 5)),
          unit: dat.sensorType == "TEMPERATURE" ? "°C" :
            dat.sensorType == "LIGHT" ? "lx" :
              dat.sensorType == "CAMERA" ? "approx. pax" :
              dat.sensorType == "HUMIDITY" ? "RH":"",
          type: beautifyText(dat.sensorType),
          name : dat.sensorName
        })
      }
      setDataList(sensorData);
    }).catch(err=>console.log(err));
  },[curEnclosure, count])

  return (
    <div>
      {curEnclosure && (
        <div >
          <Button
            onClick={() =>
              navigate(
                `/assetfacility/viewhubdetails/${curEnclosure.enclosureId}`
              )
            }

            className=""
          >
            Manage Hub and Sensor Details
          </Button>
          <br />

          {/* <EnclosurePlantationList curEnclosure={curEnclosure} /> */}
        </div>
      )}
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
