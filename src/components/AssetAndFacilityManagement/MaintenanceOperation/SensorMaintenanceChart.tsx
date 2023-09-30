
import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import useApiJson from '../../../hooks/useApiJson';
import { addQuarters } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { NavLink } from 'react-router-dom';

interface SensorMaintenanceChartProps {
    sensorId: number;
}

export default function SensorMaintenanceChart(props: SensorMaintenanceChartProps) {
    const [chartData, setChartData] = useState<any>(undefined);
    const [chartOptions, setChartOptions] = useState<any>(undefined);
    const { sensorId } = props;
    const apiJson = useApiJson();
    const navigate = useNavigate();

    useEffect(() => {
        apiJson.get(`http://localhost:3000/api/assetFacility/getSensorMaintenancePredictionValues/${sensorId}`).catch(e => console.log(e)).then(res => {
            console.log("res", res)
            res.newCycleLength.push(res.cycleLength[0])
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--text-color');
            const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
            const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
            const data = {
                labels: res.newDateResults.map((datestr: string) => new Date(datestr).toLocaleDateString()).concat(res.dateResults.map((datestr: string) => new Date(datestr).toLocaleDateString())),
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
                        position: 'right',
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder
                        }
                    },
                }
            };

            setChartData(data);
            setChartOptions(options);
        });


    }, []);

    return (
        <div className="p-10">
            <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-lg">
                <div className="flex justify-between">
                    <NavLink className="flex" to={`/assetfacility/maintenance/sensorMaintenance`}>
                        <Button variant={"outline"} type="button" className="">
                            Back
                        </Button>
                    </NavLink>
                    <span className="self-center text-title-xl font-bold">
                        Sensor Maintenance Chart
                    </span>
                    <Button disabled className="invisible">
                        Back
                    </Button>
                </div>
                {chartData && <Chart type="line" data={chartData} options={chartOptions} />}
                {!chartData && <h1>No maintenance data to predict!</h1>}
            </div>
        </div>
    )
}
