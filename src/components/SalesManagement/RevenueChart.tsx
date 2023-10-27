// import React, { useEffect, useState } from "react";
// import { Chart } from "primereact/chart";

// const RevenueChart: React.FC = () => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     // Replace this with the data you have fetched
//     const revenueData = [
//       {
//         month: "2023-10",
//         totalRevenue: 275,
//       },
//       {
//         month: "2023-11",
//         totalRevenue: 180,
//       },
//     ];

//     // Convert the data to the required format
//     const chartData = revenueData.map((entry) => ({
//       month: entry.month,
//       totalRevenue: entry.totalRevenue,
//     }));

//     // Create an array with months and revenues, including zero values for missing months
//     const months = [];
//     const revenues = [];
//     const monthMap = {};

//     // Fill monthMap with data from the API response
//     chartData.forEach((entry) => {
//       const month = entry.month;
//       monthMap[month] = entry.totalRevenue;
//     });

//     // Create an array with months and revenues, filling in zero for missing months
//     const startDate = new Date("2023-10");
//     const endDate = new Date("2023-11");

//     let currentDate = startDate;

//     while (currentDate <= endDate) {
//       const monthKey = currentDate.toISOString().substr(0, 7);

//       months.push(monthKey);
//       revenues.push(monthMap[monthKey] || 0);

//       currentDate.setMonth(currentDate.getMonth() + 1);
//     }

//     setData({
//       labels: months,
//       datasets: [
//         {
//           label: "Total Revenue",
//           data: revenues,
//           fill: true,
//           borderColor: "rgba(75,192,192,1)",
//         },
//       ],
//     });
//   }, []);

//   const options = {
//     scales: {
//       y: {
//         beginAtZero: true,
//         max: 300, // Adjust the max value as needed
//       },
//     },
//   };

//   return (
//     <div className="chart">
//       <Chart type="line" data={data} options={options} />
//     </div>
//   );
// };

// export default RevenueChart;
