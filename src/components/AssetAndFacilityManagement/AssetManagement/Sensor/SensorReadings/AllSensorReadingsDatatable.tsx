
import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { addQuarters } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { NavLink } from 'react-router-dom';
import Sensor from '../../../../../models/Sensor';
import { render } from 'react-dom';
import { compareDates } from '../../../../../components/AssetAndFacilityManagement/MaintenanceOperation/SensorMaintenanceSuggestion';

interface AllSensorReadingDatatableProps {
  curSensor: Sensor;
}

export default function AllSensorReadingDatatable(props: AllSensorReadingDatatableProps) {
    const [chartData, setChartData] = useState<any>(undefined);
    const [chartOptions, setChartOptions] = useState<any>(undefined);
    const { curSensor } = props;
    const timeLimit = 1000 * 60 * 60 * 3

    useEffect(() => {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
      const limit = new Date(Date.now() - timeLimit)
      const sorted = curSensor.sensorReadings.filter(reading=>(compareDates(limit, new Date(reading.readingDate)) < 0)).sort((a,b)=> compareDates( new Date(a.readingDate), new Date(b.readingDate)));
      if (!sorted.length) return;

      const getMin = (date:Date)=> Math.floor(date.getTime() / 60000)

      let currMin = getMin(new Date(sorted[0].readingDate))
      let previousReading = sorted[0].value
      const points : number[] = [previousReading]
      const labels : string[] = [new Date(currMin*60000).toLocaleTimeString()]

      for (const reading of sorted){
        let readingDate = new Date(reading.readingDate);
        const readingMin = getMin(readingDate);
        if (readingMin==currMin){
          points[points.length-1] = (points[points.length-1] + reading.value) / 2
          previousReading = points[points.length-1]
        }else{
          currMin = currMin + 1
          while (currMin != readingMin){
            currMin % 10 == 0 ? labels.push(new Date(currMin * 60000).toLocaleTimeString()) : labels.push("")
            points.push(previousReading)
            currMin = currMin + 1
          }
          currMin % 10 == 0 ? labels.push(new Date(currMin * 60000).toLocaleTimeString()) : labels.push("")
          points.push(reading.value)
          previousReading = reading.value
        }
      }
      labels[labels.length-1] = new Date(sorted[sorted.length-1].readingDate).toLocaleTimeString()

      console.log("labels",labels)
      console.log("points",points)
      const data = {
          labels: labels,
          datasets: [
              {
                  label: curSensor.sensorType == "CAMERA" ? "No. customers" :curSensor.sensorType,
                  fill: false,
                  borderColor: documentStyle.getPropertyValue('--blue-500'),
                  yAxisID: 'y',
                  tension: 0,
                  data: points,
                  radius: 0
              }
          ]
      };
      const options = {
          scaleShowValues: true,
          stacked: false,
          maintainAspectRatio: false,
          aspectRatio: 0.6,
          plugins: {
              legend: {
                  labels: {
                      color: textColor
                  }
              }
          },
          scales: {
              x: {
                  ticks: {
                      // color: textColorSecondary,
                      autoSkip: false
                  },
                  grid: {
                        drawOnChartArea: false,
                  //     color: surfaceBorder
                  },
              },
              y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder
                  }
              }
          }
      };

      setChartData(data);
      setChartOptions(options);
    }, []);



    return (
        <div className="p-10">
            <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-lg">

                {chartData ? <Chart type="line" data={chartData} options={chartOptions} /> : <h1>No sensor data!</h1>}
            </div>
        </div>
    )
}
