import { Calendar, CalendarChangeEvent } from "primereact/calendar";
import { useEffect, useState } from "react";
import BarChart from "../../components/SalesManagement/BarChart";
import RevenueChartFinal from "../../components/SalesManagement/RevenueChartFinal";
import useApiJson from "../../hooks/useApiJson";
import { Chart } from "primereact/chart";
import { Card } from "@mui/material";
import { CardContent } from "@/components/ui/card";

interface ChartData {
  labels: string[];
  datasets: { label: string; data: number[] }[];
}
function CustomerPreferenceChartPage() {
  const apiJson = useApiJson();
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });
  const [species, setSpecies] = useState<any>();
  const [topChartData, setTopChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const labels: string[] = [];
    const datas: number[] = [];
    apiJson
      .get(`http://localhost:3000/api/species/getSpeciesLovedByAllCustomer`)
      .catch((error) => console.log(error))
      .then((result) => {
        const aggregatedArray = Object.values(result.result);
        aggregatedArray.sort(
          (a: any, b: any) => b.customerCount - a.customerCount
        );
        setSpecies(aggregatedArray);
        aggregatedArray.map((arr: any) => labels.push(arr.speciesName));
        aggregatedArray.map((arr: any) => datas.push(arr.customerCount));
        console.log(aggregatedArray);

        function generateColors(baseColor, steps) {
          const colors: string[] = [];
          const baseHSL = baseColor
            .replace("#", "")
            .match(/.{1,2}/g)
            .map((hex) => parseInt(hex, 16));
          const baseHue = baseHSL[0];
          const baseSaturation = baseHSL[1];

          for (let i = 0; i < steps; i++) {
            const lightness = (100 / steps) * i; // Adjust lightness based on steps
            const color = `hsl(${baseHue}, ${baseSaturation}%, ${lightness}%)`;
            colors.push(color);
          }

          return colors;
        }

        console.log("label " + labels);

        const data = {
          labels: labels,
          datasets: [
            {
              label: "likes",
              data: datas,
              backgroundColor: generateColors(
                "#064B27",
                aggregatedArray.length
              ),
            },
          ],
        };

        setChartData(data);

        const topLabels: string[] = [];
        const topDatas: number[] = [];

        const top3Elements = aggregatedArray.slice(0, 3);
        top3Elements.map((arr: any) => topLabels.push(arr.speciesName));
        top3Elements.map((arr: any) => topDatas.push(arr.customerCount));

        const topData = {
          labels: labels,
          datasets: [
            {
              label: "likes",
              data: datas,
            },
          ],
        };

        setTopChartData(topData);
      });
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
        labels: {
          boxWidth: 12,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Species",
        },
      },
      y: {
        title: {
          display: true,
          text: "No. of likes",
        },
      },
    },
  };

  const pieOptions = {
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
        },
      },
    },
  };

  return (
    <div className="p-10">
      {species && (
        <div>
          <div className="flex w-full flex-col gap-3 rounded-lg border border-stroke bg-white px-10 py-5 text-black shadow-default">
            <div className="mb-1 flex justify-between">
              <span className="self-center text-title-xl font-bold">
                Customer Preference Summary Report
              </span>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <div className="flex w-full flex-col gap-3 rounded-lg border border-stroke bg-white p-5 px-10 text-black shadow-default ">
              <h2 className="flex justify-center text-xl font-semibold">
                Top 3 Species
              </h2>
            </div>
          </div>
          <div className="items-centre flex justify-center p-4 pt-8">
            <div className="w-full">
              <Card className="relative w-full">
                <CardContent className=" relative h-40 w-full overflow-hidden rounded-md bg-white p-2">
                  <img
                    src={`http://localhost:3000/${species[0].imageUrl}`}
                    alt="Card Image"
                    className=" h-full w-full rounded-md object-cover p-2"
                  />
                </CardContent>
              </Card>
              <div className="flex justify-center pt-2 font-medium">
                {species[0].speciesName}
              </div>
              <div className="flex justify-center font-medium">
                Likes: {species[0].customerCount}
              </div>
            </div>

            <div className="ml-5 w-full">
              <Card className="relative w-full">
                <CardContent className=" relative h-40 w-full overflow-hidden rounded-md bg-white p-2">
                  <img
                    src={`http://localhost:3000/${species[1].imageUrl}`}
                    alt="Card Image"
                    className="h-full w-full rounded-md object-cover p-2"
                  />
                </CardContent>
              </Card>
              <div className="flex justify-center pt-2 font-medium">
                {species[1].speciesName}
              </div>
              <div className="flex justify-center font-medium">
                Likes: {species[1].customerCount}
              </div>
            </div>
            <div className="ml-5 w-full">
              <Card className="relative w-full">
                <CardContent className=" relative h-40 w-full overflow-hidden rounded-md bg-white p-2">
                  <img
                    src={`http://localhost:3000/${species[2].imageUrl}`}
                    alt="Card Image"
                    className="h-full w-full rounded-md object-cover p-2"
                  />
                </CardContent>
              </Card>
              <div className="flex justify-center pt-2 font-medium">
                {species[2].speciesName}
              </div>
              <div className="flex justify-center font-medium">
                Likes: {species[2].customerCount}
              </div>
            </div>
          </div>
          {/* <div className="flex gap-2 pt-2">
        <div className="w-3/4" id="revenueChartContainer">
          <div className="h-full rounded-lg border border-stroke bg-white p-10 text-black shadow-default">
            <RevenueChartFinal startDate={startDate} endDate={endDate} />
          </div>
        </div>
        <div className="w-1/4" id="revenueChartContainer">
          <div className="h-full rounded-lg border border-stroke bg-white p-10 text-black shadow-default">
            <RevenueChartFinal startDate={startDate} endDate={endDate} />
          </div>
        </div>
      </div> */}
          <div className="flex gap-2 pt-2">
            <div className="flex w-full flex-col gap-3 rounded-lg border border-stroke bg-white p-5 px-10 text-black shadow-default ">
              <h2 className="flex justify-center text-xl font-semibold">
                For All Species
              </h2>
            </div>
          </div>
          <div className="flex w-full gap-2 pt-2">
            <div className="flex w-full flex-row" id="barChartContainer">
              <div className="h-full flex-grow rounded-lg border border-stroke bg-white p-4 text-black shadow-default">
                {chartData.labels.length > 0 && (
                  <Chart
                    type="bar"
                    data={chartData}
                    options={chartOptions}
                    className="p-0"
                  />
                )}
              </div>
              <div className="h-full rounded-lg border border-stroke bg-white p-10 text-black shadow-default">
                {chartData.labels.length > 0 && (
                  <Chart
                    type="pie"
                    data={chartData}
                    options={pieOptions}
                    className=" h-60"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

{
  /*<div>
              <div className="flex justify-center">
                {species[1].speciesName}
              </div>
              <div
                className={`}
            flex h-20 w-40 items-end justify-center bg-black text-white`}
              >
                Likes: {species[0].customerCount}
              </div>
            </div>
            <div className="ml-5">
              <div className="flex justify-center">
                {species[0].speciesName}
              </div>
              <div
                className={`}
            flex h-30 w-40 items-end justify-center bg-black text-white`}
              >
                Likes: {species[0].customerCount}
              </div>
            </div>
            <div className="ml-5 ">
              <div className="flex justify-center">
                {species[2].speciesName}
              </div>
              <div
                className={`flex h-10 w-40 items-end justify-center bg-black text-white`}
              >
                Likes: {species[2].customerCount}
              </div>
            </div> */
}

export default CustomerPreferenceChartPage;
