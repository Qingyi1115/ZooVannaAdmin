import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { Calendar, CalendarChangeEvent } from "primereact/calendar";
import useApiJson from "../../hooks/useApiJson";
import Listing from "../../models/Listing";

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

  const fetchListingNames = async (listingIds: string[]) => {
    const listingNames = [];
    for (const listingId of listingIds) {
      const listingResponse = await apiJson.get(
        `http://localhost:3000/api/listing/getListing/${listingId}`
      );
      const listing: Listing = listingResponse.result as Listing;
      listingNames.push(`${listing.listingType} - ${listing.name}`);
    }
    return listingNames;
  };

  const mapMonthNumbersToNames = (monthNumbers: number[]): string[] => {
    const months: string[] = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return monthNumbers.map((monthNumber) => {
      return months[monthNumber]; // Subtract 1 as month numbers are 1-based
    });
  };

  // Function to select the appropriate utility function based on criteria
  const mapLabels = async (criteria: string, data: any) => {
    if (criteria === "month") {
      const monthNumbers = data as number[];
      return mapMonthNumbersToNames(monthNumbers);
    } else {
      const listingIds = data as string[];
      return fetchListingNames(listingIds);
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

        console.log(startDate);
        console.log(endDate);

        if (groupBy.length === 2) {
          const jsonData = responseJson as JSONData;

          const reformatData = (data: JSONData): ChartData => {
            const labels = Object.keys(data);
            // console.log(labels);
            const allSubgroups = new Set<string>();

            // Collect all subgroups
            labels.forEach((label) => {
              const subgroupKeys = Object.keys(data[label]);
              subgroupKeys.forEach((subgroupKey) => {
                allSubgroups.add(subgroupKey);
              });
            });
            console.log(allSubgroups);

            // Sort subgroups
            const sortedSubgroups = Array.from(allSubgroups).sort(
              (a, b) => Number(a) - Number(b)
            );
            console.log(sortedSubgroups);

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

          const parentLabels = await mapLabels(groupBy[0], chartData.labels);
          chartData.labels = parentLabels;

          const modifyDatasetPromises = chartData.datasets.map(
            async (dataset) => {
              const modifiedLabel = (
                await mapLabels(groupBy[1], [dataset.label])
              )[0];
              console.log(dataset.label);
              console.log(modifiedLabel);
              dataset.label = modifiedLabel;
            }
          );

          await Promise.all(modifyDatasetPromises);

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
          const parentLabels = await mapLabels(groupBy[0], chartData.labels);
          chartData.labels = parentLabels;

          setChartData(chartData);
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchSalesData();
  }, [groupBy, startDate, endDate]);

  const chartOptions = {
    responsive: true, // Make the chart responsive
    maintainAspectRatio: true, // Allow the chart to adjust aspect ratio
    // Additional chart options
  };

  const handleEndDateChange = (e: CalendarChangeEvent) => {
    if (e.value !== null) {
      // Get the current date
      const selectedDate = new Date(e.value as Date);

      // Set the date to the last day of the month
      selectedDate.setMonth(selectedDate.getMonth() + 1, 0);

      // Update the state with the last day of the month
      setEndDate(selectedDate);
    }
  };

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
          <div>Start Month</div>
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
          <div>End Month</div>
          <Calendar
            style={{ flexGrow: 1 }}
            value={endDate}
            onChange={handleEndDateChange}
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

      <Chart type="bar" data={chartData} options={chartOptions} />
    </div>
  );
};

export default BarChart;
