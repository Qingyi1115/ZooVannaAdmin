
import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { addQuarters } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
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

  const [intervalDurationInMilliseconds, setIntervalDurationInMilliseconds] = useState<any>(60 * 1000);
  const [intervalFrequency, setIntervalFrequency] = useState<any>(80);
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 1000 * 60 * 60 * 3));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [minDate, setMinDate] = useState<Date>(new Date(Date.now() - 1000 * 60 * 60 * 3));
  const [refresh, setRefresh] = useState<any>(0);

  useEffect(() => {
    setIntervalDurationInMilliseconds((endDate.getTime() - startDate.getTime()) / 500);
    apiJson.post(
      `http://localhost:3000/api/assetFacility/getSensorReading/${sensorId}`,
      { startDate: startDate, endDate: endDate }
    ).then(res => {
      setMinDate(new Date(res.earlestDate));
      const curSensor = res.sensor;
      const sensorReadings = (res.sensorReadings as SensorReading[]);
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
  }, [refresh, intervalDurationInMilliseconds, intervalFrequency]);

  useEffect(() => {
    const looper = () => {
      setRefresh([])
      setTimeout(() => {
        looper()
      }, 5000)
    };
    looper();
  }, [])


  return (
    <div className="p-10">
      <div className="">

        {chartData ?
          <div>
            <div className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-12">
              {/* Start Date */}
              <div className="flex justify-content-center">
                <label htmlFor="startDateCalendar" className="self-center mx-3 text-lg text-graydark">Start Date</label>
                <Calendar id="startDateCalendar" showTime hourFormat="12" value={startDate} minDate={minDate} maxDate={endDate} onChange={(e: CalendarChangeEvent) => {
                  if (e && e.value !== null) {
                    let selStartDate:Date = e.value as Date;
                    setStartDate(selStartDate);
                    if (compareDates(endDate, selStartDate) > 1000 * 60 * 60 * 24 * 7){
                      setEndDate(new Date(selStartDate.getTime() + 1000 * 60 * 60 * 24 * 7))
                    }
                    setRefresh([])
                  }
                }} />
              </div>
              {/* End Date */}
              <div className=" flex justify-content-center">
                <label htmlFor="startDateCalendar"  className="self-center mx-3 text-lg text-graydark">End Date</label>
                <Calendar value={endDate} showTime hourFormat="12" maxDate={new Date()} minDate={startDate} onChange={(e: CalendarChangeEvent) => {
                  if (e && e.value !== null) {
                    let selEndDate:Date = e.value as Date;
                    setEndDate(selEndDate);
                    if (compareDates(selEndDate, startDate) > 1000 * 60 * 60 * 24 * 7){
                      setStartDate(new Date(selEndDate.getTime() - 1000 * 60 * 60 * 24 * 7))
                    }
                    setRefresh([])
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
