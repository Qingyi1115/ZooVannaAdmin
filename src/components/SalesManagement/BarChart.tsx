import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { Calendar, CalendarChangeEvent } from "primereact/calendar";
import useApiJson from "../../hooks/useApiJson";

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
}

interface JSONData {
  [key: string]: {
    [key: string]: number;
  };
}

interface JSONData1 {
  [key: string]: number;
}

const BarChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });
  const apiJson = useApiJson();

  const [startDate, setStartDate] = useState<string | Date | Date[] | null>(
    new Date(new Date().setMonth(new Date().getMonth() - 3))
  );
  const [endDate, setEndDate] = useState<string | Date | Date[] | null>(
    new Date(new Date().setMonth(new Date().getMonth() + 3))
  );

  //   const [startDate, setStartDate] = useState(
  //     new Date().setMonth(new Date().getMonth() - 3)
  //   );
  //   const [endDate, setEndDate] = useState(
  //     new Date().setMonth(new Date().getMonth() + 3)
  //   );

  const [groupBy, setGroupBy] = useState<string[]>(["listingId"]);

  const handleCheckboxChange = (event: CheckboxChangeEvent, value: string) => {
    if (event.checked !== undefined) {
      if (event.checked) {
        setGroupBy((prevGroupBy) => [...prevGroupBy, value]);
      } else {
        setGroupBy((prevGroupBy) =>
          prevGroupBy.filter((item) => item !== value)
        );
      }
    }
  };

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const dataRequest = {
          startDate: startDate,
          endDate: endDate,
          groupBy: groupBy,
        };

        const responseJson = await apiJson.post(
          `http://localhost:3000/api/customerOrder/getTotalCustomerOrder/`,
          dataRequest
        );

        if (groupBy.length === 2) {
          const jsonData = responseJson as JSONData;
          const reformatData = (data: JSONData): ChartData => {
            const labels = Object.keys(data);
            const allSubgroups = new Set<string>();

            // Collect all subgroups
            labels.forEach((label) => {
              const subgroupKeys = Object.keys(data[label]);
              subgroupKeys.forEach((subgroupKey) => {
                allSubgroups.add(subgroupKey);
              });
            });

            // Sort subgroups
            const sortedSubgroups = Array.from(allSubgroups).sort();

            // Create datasets including all subgroups
            const datasets = sortedSubgroups.map((subgroup) => ({
              label: subgroup,
              data: labels.map((label) => data[label][subgroup] || 0), // Use 0 for missing data
            }));

            return {
              labels,
              datasets,
            };
          };
          const chartData = reformatData(jsonData);
          setChartData(chartData);
        } else {
          const jsonData = responseJson as JSONData1;
          const labels = Object.keys(jsonData);
          const datasets = [
            {
              label: "Sales",
              data: labels.map((label) => jsonData[label]),
            },
          ];

          const chartData: ChartData = {
            labels: labels,
            datasets: datasets,
          };

          setChartData(chartData);
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchSalesData();
  }, [groupBy, startDate, endDate]);

  return (
    <div>
      <div className="mb-4 flex justify-between">
        {/* <NavLink to={"/customerOrder/createnewcustomerOrder"}>
                <Button className="mr-2">
                  <HiPlus className="mr-auto" />
                  Add CustomerOrder
                </Button>
              </NavLink> */}
        <span className=" self-center text-title-xl font-bold">
          Sales Graph
        </span>
      </div>
      <div className="mb-6 flex flex-col justify-start gap-6 lg:flex-row lg:gap-12">
        {/* Start Date */}
        <div className="card justify-content-centre flex flex-col">
          <div>Start Date</div>
          <Calendar
            style={{ flexGrow: 1 }}
            value={startDate}
            onChange={(e: CalendarChangeEvent) => {
              if (e && e.value !== undefined) {
                setStartDate(e.value);
              }
            }}
            view="month"
            dateFormat="mm/yy"
          />
        </div>
        {/* End Date */}
        <div className="card justify-content-center flex flex-col">
          <div>End Date</div>
          <Calendar
            style={{ flexGrow: 1 }}
            value={endDate}
            onChange={(e: CalendarChangeEvent) => {
              if (e && e.value !== undefined) {
                setEndDate(e.value);
              }
            }}
            view="month"
            dateFormat="mm/yy"
          />
        </div>
        <div>
          <h2>Group by:</h2>
          <div>
            <Checkbox
              inputId="listingIdCheckbox"
              value="listingId"
              checked={groupBy.includes("listingId")}
              onChange={(e) => handleCheckboxChange(e, "listingId")}
            />
            <label htmlFor="listingIdCheckbox">Listing ID</label>
          </div>

          <div>
            <Checkbox
              inputId="monthCheckbox"
              value="month"
              checked={groupBy.includes("month")}
              onChange={(e) => handleCheckboxChange(e, "month")}
            />
            <label htmlFor="monthCheckbox">Month</label>
          </div>
        </div>
      </div>

      <Chart type="bar" data={chartData} />
    </div>
  );
};

export default BarChart;
