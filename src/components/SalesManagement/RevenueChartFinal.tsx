// import React, { useEffect, useState } from "react";
// import { Chart } from "primereact/chart";
// import useApiJson from "../../hooks/useApiJson";

// interface LineChartProps {
//   startDate: Date;
//   endDate: Date;
// }

// const RevenueChartFinal: React.FC<LineChartProps> = ({
//   startDate,
//   endDate,
// }) => {
//   const [data, setData] = useState(null);
//   const apiJson = useApiJson();

//   useEffect(() => {
//     const fetchSalesData = async () => {
//       try {
//         const dataRequest = {
//           startDate: startDate,
//           endDate: endDate,
//         };

//         const responseJson = await apiJson.post(
//           `http://localhost:3000/api/customerOrder/getRevenueByMonth`,
//           dataRequest
//         );

//         console.log(responseJson);
//         console.log(Object.keys(responseJson));
//         console.log(Object.values(responseJson));

//         const chartData = {
//           labels: Object.keys(responseJson),
//           datasets: [
//             {
//               label: "Revenue",
//               data: Object.values(responseJson),
//               fill: false,
//               borderColor: "#007bff",
//             },
//           ],
//         };

//         setData(chartData);

//       } catch (error: any) {
//         console.log(error);
//       }
//     };
//     fetchSalesData();
//   }, []);

//   const chartData = {
//     labels: Object.keys(data),
//     datasets: [
//       {
//         label: "Revenue",
//         data: Object.values(data),
//         fill: false,
//         borderColor: "#007bff",
//       },
//     ],
//   };

//   const options = {
//     scales: {
//       x: {
//         type: "category",
//         title: {
//           display: true,
//           text: "Month",
//         },
//       },
//       y: {
//         title: {
//           display: true,
//           text: "Revenue",
//         },
//       },
//     },
//   };

//   return (
//     <div>
//       {data && <Chart type="line" data={chartData} options={options} />}
//     </div>
//   );
// };

// export default RevenueChartFinal;

import React, { useEffect, useState } from "react";
import { Chart } from "primereact/chart";
import useApiJson from "../../hooks/useApiJson";

interface LineChartProps {
  startDate: Date;
  endDate: Date;
}

const RevenueChartFinal: React.FC<LineChartProps> = ({
  startDate,
  endDate,
}) => {
  const [data, setData] = useState({});
  const apiJson = useApiJson();

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const dataRequest = {
          startDate: startDate,
          endDate: endDate,
        };

        const responseJson = await apiJson.post(
          `http://localhost:3000/api/customerOrder/getRevenueByMonth`,
          dataRequest
        );

        console.log("useEffect");

        const chartData = {
          labels: Object.keys(responseJson),
          datasets: [
            {
              label: "Revenue",
              data: Object.values(responseJson),
              fill: false,
              borderColor:
                document.documentElement.style.getPropertyValue("--blue-500"), // Use the CSS variable
              tension: 0.4,
            },
          ],
        };

        setData(chartData);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchSalesData();
  }, [startDate, endDate]);

  const options = {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        labels: {
          color:
            document.documentElement.style.getPropertyValue("--text-color"), // Use the CSS variable
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: document.documentElement.style.getPropertyValue(
            "--text-color-secondary"
          ), // Use the CSS variable
        },
        grid: {
          color:
            document.documentElement.style.getPropertyValue("--surface-border"), // Use the CSS variable
        },
      },
      y: {
        ticks: {
          color: document.documentElement.style.getPropertyValue(
            "--text-color-secondary"
          ), // Use the CSS variable
        },
        grid: {
          color:
            document.documentElement.style.getPropertyValue("--surface-border"), // Use the CSS variable
        },
      },
    },
  };

  return (
    <div>
      <h2>Revenue</h2>
      <Chart type="line" data={data} options={options} />
    </div>
  );
};

export default RevenueChartFinal;
