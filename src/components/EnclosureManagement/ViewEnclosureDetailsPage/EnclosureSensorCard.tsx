

import { Chart } from "primereact/chart";
import React, { useEffect, useState } from "react";
import useApiJson from "../../../hooks/useApiJson";

interface LineChartProps {
    labels: string[];
    values: number[];
    type: string;
    unit: string;
    name: string;
}

const EnclosureSensorCard: React.FC<LineChartProps> = ({
  labels, values, unit, type, name
}) => {
  const [data, setData] = useState({});
  const [sum, setSum] = useState<number>(0);
  const apiJson = useApiJson();

  useEffect(() => {
    const fetchSalesData = async () => {
      try {

        const chartData = {
          labels: labels,
          datasets: [
            {
              label: "Revenue",
              data: values,
              fill: false,
              // borderColor: "black",
              tension: 0.4,
            },
          ],
        };

        const sum: number = values[values.length - 1];

        setData(chartData);
        setSum(sum);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchSalesData();
  }, [labels, values]);

  const options = {
    maintainAspectRatio: false,
    aspectRatio: 1.7,
    plugins: {
      legend: {
        display: false,
      },
    },

    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
        ticks: {
          color: document.documentElement.style.getPropertyValue(
            "--text-color-secondary"
          ),
        },
        grid: {
          display: false,
        },
      },

      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Reading",
        },
        ticks: {
          color: document.documentElement.style.getPropertyValue(
            "--text-color-secondary"
          ),
        },
        grid: {
          display: true,
        },
      },
    },
  };

  const startDateFormatted = labels[0];

  const endDateFormatted = labels[1];

    return (
      <div>
    <div className="flex gap-2 pt-2">
      <div className="flex w-full flex-col gap-3 rounded-lg border border-stroke bg-white p-5 px-10 text-black shadow-default ">
        <h2 className="text-xl font-semibold">{name}</h2>
      </div>
    </div>
    <div className="flex gap-2 pt-2">
      <div className="w-3/4" id="revenueChartContainer">
        <div className="h-full rounded-lg border border-stroke bg-white p-10 text-black shadow-default">
          <Chart type="line" data={data} options={options} />
        </div>
      </div>
      <div className="w-1/4 " id="revenueChartContainer">
        <div className="flex h-full flex-col items-center justify-center rounded-lg border border-stroke bg-white p-10 text-black shadow-default">
          <h2 className="pb-3 text-center text-xl font-semibold">
            {type}
              </h2>
              {
                sum ? (
                  <div>
                    <h1 className="pb-4 text-center text-6xl font-semibold">
                      {Math.round(sum * 100) / 100}<span className="text-s">{" " + unit}</span> 
                    </h1>
                    
                    <p className="text-s pb-3 text-center">
                      from {startDateFormatted} to {endDateFormatted}
                    </p>
                  </div>
                ): (
                    
                  <h1 className="pb-4 text-center text-6xl font-semibold">
                    No Data! 
                  </h1>
                )
            }
        </div>
      </div>
      {/* <h2 className="pb-3 text-xl font-semibold">Revenue</h2> */}
      {/* <Chart type="line" data={data} options={options} /> */}
    </div></div>
  );
};

export default EnclosureSensorCard;
