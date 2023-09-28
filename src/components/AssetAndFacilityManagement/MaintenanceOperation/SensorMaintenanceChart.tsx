
import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import useApiJson from '../../../hooks/useApiJson';
import { addQuarters } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

interface SensorMaintenanceChartProps {
    sensorId: number;
  }

export default function SensorMaintenanceChart(props: SensorMaintenanceChartProps) {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const { sensorId } = props;
    const apiJson = useApiJson();
    const navigate = useNavigate();

    useEffect(() => {
        apiJson.get(`http://localhost:3000/api/assetFacility/getSensorMaintenancePredictionValues/${sensorId}`).catch(e => console.log(e)).then(res => {
            console.log("res",res)
            res.newCycleLength.push(res.cycleLength[0])
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--text-color');
            const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
            const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
            const data = {
                labels: res.newDateResults.map((datestr:string) => new Date(datestr).toLocaleDateString()).concat(res.dateResults.map((datestr:string) => new Date(datestr).toLocaleDateString())),
                datasets: [
                    {
                        label: 'Maintenance cycle length',
                        fill: false,
                        borderColor: documentStyle.getPropertyValue('--blue-500'),
                        yAxisID: 'y',
                        tension: 0.2,
                        data: new Array(res.newDateResults.length).fill(null).concat(res.cycleLength)
                    },
                    {
                        label: 'Predicted cycle length',
                        fill: false,
                        borderColor: documentStyle.getPropertyValue('--red-500'),
                        yAxisID: 'y',
                        tension: 0.2,
                        data: res.newCycleLength
                    }
                ]
            };
            const options = {
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
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder
                        }
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
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            drawOnChartArea: false,
                            color: surfaceBorder
                        }
                    }
                }
            };

            setChartData(data);
            setChartOptions(options);
        });


    }, []);

    return (
        <div className="card">
                <Button variant={"outline"} type="button" onClick={() => navigate(-1)} className="">
              Back
            </Button>
            <Chart type="line" data={chartData} options={chartOptions} />
        </div>
    )
}
        