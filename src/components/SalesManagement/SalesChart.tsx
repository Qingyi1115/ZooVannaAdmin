import React, { useEffect, useState } from "react";
import useApiJson from "../../../hooks/useApiJson";
import Species from "../../../models/Species";
import {
  AnimalFeedCategory,
  AnimalGrowthStage,
  PresentationContainer,
  PresentationLocation,
  PresentationMethod,
} from "../../../enums/Enumurated";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PhysioRefNormDatatable from "./PhysioRefNormDatatable";
import PhysiologicalReferenceNorms from "../../../models/PhysiologicalReferenceNorms";

import { Chart } from "primereact/chart";

function SalesChart() {

  const apiJson = useApiJson();

//   const [physiologicalRefNormsList, setPhysiologicalRefNormsList] = useState<
//     PhysiologicalReferenceNorms[]
//   >([]);
  const [resetSeed, setResetSeed] = useState<number>(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(new Date());
  const [groupBy, setGroupBy] = useState(["month"]);
  const [data, setData] = useState([]);

//   const monthLabels: string[] = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];

//   function getLabels(groupBy, data) {
//   if (groupBy.includes('month')) {
//     // If grouping by month, get the distinct months from the data
//     const distinctMonths = Array.from(new Set(data.map(item => item.month)));
//     return distinctMonths.map(month => getMonthLabel(month)); // Use a function to convert month number to label
//   } else if (groupBy.includes('listingId')) {
//     // If grouping by listingId, get the distinct listing IDs from the data
//     const distinctListingIds = Array.from(new Set(data.map(item => item.listingId)));
//     return distinctListingIds.map(listingId => `Listing ID ${listingId}`);
//   } else if (groupBy.includes('listingType')) {
//     // If grouping by listingType, get the distinct listing types from the data
//     const distinctListingTypes = Array.from(new Set(data.map(item => item.listingType)));
//     return distinctListingTypes;
//   }
//   // Handle other cases as needed
//   return [];
// }

// function getMonthLabel(month: number) {
//   // This function can be used to convert month numbers to labels
//   const monthNames = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];
//   return monthNames[month - 1]; // Subtract 1 because month numbers are 1-based
// }

  


  // chart
//   const [weightChartData, setWeightChartData] = useState({});
//   const [weightChartOptions, setWeightChartOptions] = useState({});
//   const [sizeChartData, setSizeChartData] = useState({});
//   const [sizeChartOptions, setSizeChartOptions] = useState({});

//   const customPhysioRefNormsSortFunction = (
//     a: PhysiologicalReferenceNorms,
//     b: PhysiologicalReferenceNorms
//   ) => {
//     const customSortOrder = [
//       "INFANT",
//       "JUVENILE",
//       "ADOLESCENT",
//       "ADULT",
//       "ELDER",
//     ];
//     const indexA = customSortOrder.indexOf(a.growthStage);
//     const indexB = customSortOrder.indexOf(b.growthStage);

//     // Compare based on the custom sort order indexes
//     if (indexA < indexB) return -1;
//     if (indexA > indexB) return 1;
//     return 0;
//   };

  useEffect(() => {
    const fetchSalesData = async () => {
      try {

        const dataRequest = {
            startDate: startDate,
            endDate: endDate,
            groupBy: groupBy,
          }

        const responseJson = await apiJson.post(
          `http://localhost:3000/api/customerOrder/getTotalCustomerOrder/`,
          dataRequest
        );

        setData(responseJson as );

      } catch (error: any) {
        console.log(error);
      }
    };
    fetchSalesData();


  }, [resetSeed]);

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    const minWeightMaleDataPoints = physiologicalRefNormsList.flatMap(
      (item) => [
        { x: item.minAge, y: item.minWeightMaleKg },
        { x: item.maxAge, y: item.minWeightMaleKg },
      ]
    );
    const maxWeightMaleDataPoints = physiologicalRefNormsList.flatMap(
      (item) => [
        { x: item.minAge, y: item.maxWeightMaleKg },
        { x: item.maxAge, y: item.maxWeightMaleKg },
      ]
    );
    const minWeightFemaleDataPoints = physiologicalRefNormsList.flatMap(
      (item) => [
        { x: item.minAge, y: item.minWeightFemaleKg },
        { x: item.maxAge, y: item.minWeightFemaleKg },
      ]
    );
    const maxWeightFemaleDataPoints = physiologicalRefNormsList.flatMap(
      (item) => [
        { x: item.minAge, y: item.maxWeightFemaleKg },
        { x: item.maxAge, y: item.maxWeightFemaleKg },
      ]
    );

    const data = {
      // labels: ["INFANT", "JUVENILE", "ADOLESCENT", "ADULT", "ELDER"],
      datasets: [
        {
          label: "Min Weight Male (kg)",
          data: minWeightMaleDataPoints,
          fill: { target: "+1", above: "#93C5FD50", below: "#93C5FD50" },
          borderColor: "#3b82f6",
          tension: 0.4,
        },
        {
          label: "Max Weight Male (kg)",
          data: maxWeightMaleDataPoints,
          fill: { target: "-1", above: "#93C5FD50", below: "#93C5FD50" },
          borderColor: "#3b82f6",
          tension: 0.4,
        },
        {
          label: "Min Weight Female (kg)",
          data: minWeightFemaleDataPoints,
          fill: { target: "+1", below: "#F29FD450", above: "#F29FD450" },
          borderColor: "#ec4899",
          tension: 0.4,
        },
        {
          label: "Max Weight Female (kg)",
          data: maxWeightFemaleDataPoints,
          fill: { target: "-1", below: "#F29FD450", above: "#F29FD450" },
          borderColor: "#ec4899",
          tension: 0.4,
        },
      ],
    };
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
        tooltip: {
          enabled: true, // Enable tooltips
          callbacks: {
            // Customize the tooltip label
            title: (context: any) => {
              const dataPoint = context[0].raw; // Assuming you want to use the first data point
              return `Age: ${dataPoint.x} years`;
              // Modify the title content as needed
            },
            label: (context: any) => {
              const tooltipLabel = `Weight: ${context.raw.y} kg`;
              // You can modify the tooltipLabel as needed
              return tooltipLabel;
            },
          },
        },
      },
      scales: {
        x: {
          display: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
          type: "linear",
          min: 0,
          max: curSpecies.lifeExpectancyYears * 1.2,
          title: {
            display: true,
            text: "Age (in years)",
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
          min: 0,
          title: {
            display: true,
            text: "Weight (in kg)",
          },
        },
      },
    };
    setWeightChartData(data);
    setWeightChartOptions(options);
  }, [physiologicalRefNormsList]);

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

    const minSizeMaleDataPoints = physiologicalRefNormsList.flatMap((item) => [
      { x: item.minAge, y: item.minSizeMaleCm },
      { x: item.maxAge, y: item.minSizeMaleCm },
    ]);

    const maxSizeMaleDataPoints = physiologicalRefNormsList.flatMap((item) => [
      { x: item.minAge, y: item.maxSizeMaleCm },
      { x: item.maxAge, y: item.maxSizeMaleCm },
    ]);

    const minSizeFemaleDataPoints = physiologicalRefNormsList.flatMap(
      (item) => [
        { x: item.minAge, y: item.minSizeFemaleCm },
        { x: item.maxAge, y: item.minSizeFemaleCm },
      ]
    );

    const maxSizeFemaleDataPoints = physiologicalRefNormsList.flatMap(
      (item) => [
        { x: item.minAge, y: item.maxSizeFemaleCm },
        { x: item.maxAge, y: item.maxSizeFemaleCm },
      ]
    );
    const data = {
      labels: ["INFANT", "JUVENILE", "ADOLESCENT", "ADULT", "ELDER"],
      datasets: [
        {
          label: "Male (cm)",
          data: minSizeMaleDataPoints,
          fill: { target: "+1", above: "#93C5FD50", below: "#93C5FD50" },
          borderColor: "#3b82f6",
          tension: 0.4,
        },
        {
          label: "Male (cm)",
          data: maxSizeMaleDataPoints,
          fill: { target: "-1", above: "#93C5FD50", below: "#93C5FD50" },
          borderColor: "#3b82f6",
          tension: 0.4,
        },
        {
          label: "Female (cm)",
          data: minSizeFemaleDataPoints,
          fill: { target: "+1", below: "#F29FD450", above: "#F29FD450" },
          borderColor: "#ec4899",
          tension: 0.4,
        },
        {
          label: "Female (cm)",
          data: maxSizeFemaleDataPoints,
          fill: { target: "-1", below: "#F29FD450", above: "#F29FD450" },
          borderColor: "#ec4899",
          tension: 0.4,
        },
      ],
    };
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
        tooltip: {
          enabled: true, // Enable tooltips
          callbacks: {
            // Customize the tooltip label
            title: (context: any) => {
              const dataPoint = context[0].raw; // Assuming you want to use the first data point
              return `Growth Stage: ${dataPoint.growthStage}, Age: ${dataPoint.x}`;
              // Modify the title content as needed
            },
            label: (context: any) => {
              const tooltipLabel = `Size: ${context.raw.y} cm`;
              // You can modify the tooltipLabel as needed
              return tooltipLabel;
            },
          },
        },
      },

      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
          type: "linear",
          min: 0,
          max: curSpecies.lifeExpectancyYears * 1.2,
          title: {
            display: true,
            text: "Age (in years)",
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
          min: 0,
          title: {
            display: true,
            text: "Size (in cm)",
          },
        },
      },
    };
    setSizeChartData(data);
    setSizeChartOptions(options);
  }, [physiologicalRefNormsList]);

  return (
    <div className="">
      <div className="my-4 flex justify-start gap-6">
        <NavLink to={`/species/createphysioref/${curSpecies.speciesCode}`}>
          <Button>Create New Physiological Reference Norms</Button>
        </NavLink>
      </div>

      {curSpecies && (
        <PhysioRefNormDatatable
          curSpecies={curSpecies}
          physiologicalRefNormsList={physiologicalRefNormsList}
          setPhysiologicalRefNormsList={setPhysiologicalRefNormsList}
        />
      )}
      <div>
        <span className="text-lg font-medium">
          {curSpecies.commonName} Weight Range (kg)
        </span>
        <Chart
          type="line"
          data={weightChartData}
          options={weightChartOptions}
        />
      </div>
      <br />
      <div>
        <span className="text-lg font-medium">
          {curSpecies.commonName} Size Range (cm)
        </span>
        <Chart type="line" data={sizeChartData} options={sizeChartOptions} />
      </div>
    </div>
  );
}

export default SalesChart;
