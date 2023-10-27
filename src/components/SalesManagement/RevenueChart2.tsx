import React, { useEffect, useState } from "react";
import { Chart } from "primereact/chart";

type ChartData = {
  month: string;
  totalRevenue: number;
};

const RevenueChart: React.FC = () => {
  const [data, setData] = useState<any>({}); // Use the 'any' type for now

  useEffect(() => {
    // Replace this with the data you have fetched
    const revenueData: ChartData[] = [
      {
        month: "2023-10",
        totalRevenue: 275,
      },
      {
        month: "2023-11",
        totalRevenue: 180,
      },
    ];

    // Convert the data to the required format
    const chartData = revenueData.map((entry) => ({
      month: entry.month,
      totalRevenue: entry.totalRevenue,
    }));

    // Create an array with months and revenues, including zero values for missing months
    const months: string[] = [];
    const revenues: number[] = [];
    const monthMap: { [key: string]: number } = {}; // Declare the type for monthMap

    // Fill monthMap with data from the API response
    chartData.forEach((entry) => {
      const month = entry.month;
      monthMap[month] = entry.totalRevenue;
    });

    // Rest of your code remains the same
    // ...
  }, []);

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: 300, // Adjust the max value as needed
      },
    },
  };

  return (
    <div className="chart">
      <Chart type="line" data={data} options={options} />
    </div>
  );
};

export default RevenueChart;
