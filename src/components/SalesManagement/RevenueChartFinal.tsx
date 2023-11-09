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

import { Chart } from "primereact/chart";
import React, { useEffect, useState } from "react";
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
  const [sum, setSum] = useState<number>(0);
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
              // borderColor: "black",
              tension: 0.4,
            },
          ],
        };

        const sum: number = Object.values<number>(responseJson).reduce(
          (acc, value) => acc + value,
          0
        );

        setData(chartData);
        setSum(sum);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchSalesData();
  }, [startDate, endDate]);

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
          text: "Months",
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
          text: "Revenue",
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

  const startDateFormatted = new Date(startDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });

  const endDateFormatted = new Date(endDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });

  return (
    <div className="flex gap-2 pt-2">
      <div className="w-3/4" id="revenueChartContainer">
        <div className="h-full rounded-lg border border-stroke bg-white p-10 text-black shadow-default">
          <Chart type="line" data={data} options={options} />
        </div>
      </div>
      <div className="w-1/4 " id="revenueChartContainer">
        <div className="flex h-full flex-col items-center justify-center rounded-lg border border-stroke bg-white p-10 text-black shadow-default">
          <h2 className="pb-3 text-center text-xl font-semibold">
            Total Revenue:
          </h2>
          <h1 className="pb-4 text-center text-6xl font-semibold">
            ${sum ? sum.toFixed(0) : "Calculating..."}
          </h1>
          <p className="text-s pb-3 text-center">
            from {startDateFormatted} to {endDateFormatted}
          </p>
        </div>
      </div>
      {/* <h2 className="pb-3 text-xl font-semibold">Revenue</h2> */}
      {/* <Chart type="line" data={data} options={options} /> */}
    </div>
  );
};

export default RevenueChartFinal;
