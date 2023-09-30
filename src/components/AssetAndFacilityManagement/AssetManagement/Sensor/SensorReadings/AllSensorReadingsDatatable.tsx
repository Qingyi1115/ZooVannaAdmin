
import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { addQuarters } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { NavLink } from 'react-router-dom';
import Sensor from '../../../../../models/Sensor';
import { render } from 'react-dom';
import { compareDates } from '../../../../../components/AssetAndFacilityManagement/MaintenanceOperation/SensorMaintenanceSuggestion';
import useApiJson from '../../../../../hooks/useApiJson';
import SensorReading from 'src/models/SensorReading';
import { Calendar, CalendarChangeEvent } from 'primereact/calendar';

interface AllSensorReadingDatatableProps {
  sensorId: string;
}

export default function AllSensorReadingDatatable(props: AllSensorReadingDatatableProps) {
  const [chartData, setChartData] = useState<any>(undefined);
  const [chartOptions, setChartOptions] = useState<any>(undefined);
  const { sensorId } = props;
  const apiJson = useApiJson();

  const [timeLimit, setTimeLimit] = useState<number>(1000 * 60 * 60 * 3);
  const [intervalDurationInMilliseconds, setIntervalDurationInMilliseconds] = useState<any>(60 * 100);
  const [intervalFrequency, setIntervalFrequency] = useState<any>(100);
  const [startDate, setStartDate] = useState<any>(new Date(Date.now() - timeLimit));
  const [endDate, setEndDate] = useState<any>(new Date());
  const [refresh, setRefresh] = useState<any>(0);

  useEffect(() => {
    apiJson.post(
      `http://localhost:3000/api/assetFacility/getSensorReading/${sensorId}`,
      { startDate: startDate, endDate: endDate }
    ).then(res => {
      const curSensor = res.sensor;
      const sensorReadings = (res.sensorReadings as SensorReading[]);

      console.log("Updated chart!")
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
      const sorted = sensorReadings.sort((a, b) => compareDates(new Date(a.readingDate), new Date(b.readingDate)));
      if (!sorted.length) return;

      const getInterval = (date: Date) => Math.floor(date.getTime() / intervalDurationInMilliseconds)

      let currMin = getInterval(new Date(sorted[0].readingDate))
      let previousReading = sorted[0].value
      const points: number[] = [previousReading]
      const labels: string[] = [new Date(currMin * intervalDurationInMilliseconds).toLocaleTimeString()]

      for (const reading of sorted) {
        let readingDate = new Date(reading.readingDate);
        const readingMin = getInterval(readingDate);
        if (readingMin == currMin) {
          points[points.length - 1] = (points[points.length - 1] + reading.value) / 2
          previousReading = points[points.length - 1]
        } else {
          currMin = currMin + 1
          while (currMin != readingMin) {
            currMin % intervalFrequency == 0 ? labels.push(new Date(currMin * intervalDurationInMilliseconds).toLocaleTimeString()) : labels.push("")
            points.push(previousReading)
            currMin = currMin + 1
          }
          currMin % intervalFrequency == 0 ? labels.push(new Date(currMin * intervalDurationInMilliseconds).toLocaleTimeString()) : labels.push("")
          points.push(reading.value)
          previousReading = reading.value
        }
      }
      labels[labels.length - 1] = new Date(sorted[sorted.length - 1].readingDate).toLocaleTimeString()

      const data = {
        labels: labels,
        datasets: [
          {
            label: curSensor.sensorType == "CAMERA" ? "No. customers" : curSensor.sensorType,
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
        animation: {
          duration: 0
        },
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
    }).catch(e => console.log(e));
  }, [refresh, timeLimit, intervalDurationInMilliseconds, intervalFrequency, startDate, endDate, refresh]);

  useEffect(() => {
    const looper = () => {
      setRefresh([])
      setTimeout(() => {
        looper()
      }, 10000)
    };
    looper();
  }, [])


  return (
    <div className="p-10">
      <div className="rounded-lg bg-white p-4">

        {chartData ?
          <div>
            <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
              {/* Start Date */}
              <div className="flex justify-content-center">
                <label htmlFor="startDateCalendar" className="self-center mx-3 text-lg text-graydark">Start Date</label>
                <Calendar id="startDateCalendar" value={startDate} onChange={(e: CalendarChangeEvent) => {
                  if (e && e.value !== undefined) {
                    setStartDate(e.value);
                  }
                }} />
              </div>
              {/* End Date */}
              <div className=" flex justify-content-center">
                <label htmlFor="startDateCalendar" className="self-center mx-3 text-lg text-graydark">End Date</label>
                <Calendar value={endDate} onChange={(e: CalendarChangeEvent) => {
                  if (e && e.value !== undefined) {
                    setEndDate(e.value);
                  }
                }} />
              </div>
            </div>
            <br />
            <Chart type="line" data={chartData} options={chartOptions} />
          </div>
          : <h1>No sensor data!</h1>}
      </div>
    </div>
  )
}
