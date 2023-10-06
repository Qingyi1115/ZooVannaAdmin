import React, { useEffect, useState, useRef } from "react";
import Animal from "../../../models/Animal";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SpeciesCard from "./SpeciesCard";
import EnclosureCard from "./EnclosureCard";
import AnimalWeightDatatable from "./AnimalWeightDatatable";

import useApiJson from "../../../hooks/useApiJson";

import { Chart } from "primereact/chart";
import { useToast } from "@/components/ui/use-toast";
import PhysiologicalReferenceNorms from "../../../models/PhysiologicalReferenceNorms";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimalWeight from "../../../models/AnimalWeight";

const customPhysioRefNormsSortFunction = (
  a: PhysiologicalReferenceNorms,
  b: PhysiologicalReferenceNorms
) => {
  const customSortOrder = [
    "INFANT",
    "JUVENILE",
    "ADOLESCENT",
    "ADULT",
    "ELDER",
  ];
  const indexA = customSortOrder.indexOf(a.growthStage);
  const indexB = customSortOrder.indexOf(b.growthStage);

  // Compare based on the custom sort order indexes
  if (indexA < indexB) return -1;
  if (indexA > indexB) return 1;
  return 0;
};

let testAnimalWeightList: AnimalWeight[] = [
  {
    animalWeightId: 1,
    dateOfMeasure: new Date("2018-10-02"), // Approximately 5 years ago from Oct 2, 2023
    weightInKg: 10.5,
  },
  {
    animalWeightId: 2,
    dateOfMeasure: new Date("2013-10-02"), // Approximately 10 years ago from Oct 2, 2023
    weightInKg: 12.2,
  },
  {
    animalWeightId: 3,
    dateOfMeasure: new Date("2003-10-02"), // Approximately 20 years ago from Oct 2, 2023
    weightInKg: 15.8,
  },
  {
    animalWeightId: 4,
    dateOfMeasure: new Date("1993-10-02"), // Approximately 30 years ago from Oct 2, 2023
    weightInKg: 18.3,
  },
  {
    animalWeightId: 5,
    dateOfMeasure: new Date("2023-10-02"), // Current date
    weightInKg: 22.1,
  },
];

interface AnimalWeightInfoProps {
  curAnimal: Animal;
}

function AnimalWeightInfo(props: AnimalWeightInfoProps) {
  const { curAnimal } = props;

  const apiJson = useApiJson();
  const toastShadcn = useToast().toast;

  const [animalWeightList, setAnimalWeightList] = useState<AnimalWeight[]>([]);
  const [physiologicalRefNormsList, setPhysiologicalRefNormsList] = useState<
    PhysiologicalReferenceNorms[]
  >([]);

  const [weightChartData, setWeightChartData] = useState({});
  const [weightChartOptions, setWeightChartOptions] = useState({});

  //
  useEffect(() => {
    const fetchAnimalWeight = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/animal//getAllAnimalWeightsByAnimalCode/${curAnimal.animalCode}`
        );
        setAnimalWeightList(responseJson as AnimalWeight[]);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchAnimalWeight();
  }, []);

  // Weight chart
  useEffect(() => {
    const fetchPhysioRefNormsList = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/species/getAllPhysiologicalReferenceNormsByCode/${curAnimal.species.speciesCode}`
        );
        // sort list first
        const rawPhysioRefNormsList =
          responseJson as PhysiologicalReferenceNorms[];
        const sortedPhysioRefNormsList = rawPhysioRefNormsList.sort(
          customPhysioRefNormsSortFunction
        );
        setPhysiologicalRefNormsList(sortedPhysioRefNormsList);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchPhysioRefNormsList();
  }, []);

  function calculateAge(dateOfMeasure: Date, dateOfBirth: Date): number {
    const dob = dateOfBirth;
    const measureDate = dateOfMeasure;

    // Calculate the difference in milliseconds between the two dates
    const ageInMilliseconds = measureDate.getTime() - dob.getTime();

    // Convert milliseconds to years (assuming an average year has 365.25 days)
    const ageInYears = ageInMilliseconds / (365.25 * 24 * 60 * 60 * 1000);

    return ageInYears;
  }

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
    const weightRecordDataPoints = animalWeightList.map((record) => ({
      x: calculateAge(
        new Date(record.dateOfMeasure),
        new Date(curAnimal.dateOfBirth)
      ), // Calculate age using the provided function
      y: record.weightInKg,
    }));

    const maleDataset = [
      {
        label: "Weight Records",
        data: weightRecordDataPoints,
        pointBackgroundColor: "rgba(255, 0, 0, 1)", // Customize the point color
        pointRadius: 5, // Customize the point size
        showLine: false, // Hide the line connecting the points
      },
      {
        label: "Min Weight Male (kg)",
        data: minWeightMaleDataPoints,
        fill: { target: "+1", above: "#93C5FD", below: "#93C5FD" },
        borderColor: "#3b82f6",
        tension: 0.4,
      },
      {
        label: "Max Weight Male (kg)",
        data: maxWeightMaleDataPoints,
        fill: { target: "-1", above: "#93C5FD", below: "#93C5FD" },
        borderColor: "#3b82f6",
        tension: 0.4,
      },
    ];

    const femaleDataset = [
      {
        label: "Weight Records",
        data: weightRecordDataPoints,
        pointBackgroundColor: "rgba(255, 0, 0, 1)", // Customize the point color
        pointRadius: 5, // Customize the point size
        showLine: false, // Hide the line connecting the points
      },
      {
        label: "Min Weight Female (kg)",
        data: minWeightFemaleDataPoints,
        fill: { target: "+1", below: "#F29FD4", above: "#F29FD4" },
        borderColor: "#ec4899",
        tension: 0.4,
      },
      {
        label: "Max Weight Female (kg)",
        data: maxWeightFemaleDataPoints,
        fill: { target: "-1", below: "#F29FD4", above: "#F29FD4" },
        borderColor: "#ec4899",
        tension: 0.4,
      },
    ];

    const data = {
      // labels: ["INFANT", "JUVENILE", "ADOLESCENT", "ADULT", "ELDER"],
      datasets:
        curAnimal.sex == "MALE"
          ? maleDataset
          : curAnimal.sex == "FEMALE"
          ? femaleDataset
          : [...maleDataset, ...femaleDataset],
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
          // mode: "index",
          // intersect: "false",
          callbacks: {
            // Customize the tooltip label
            title: (context: any) => {
              const dataPoint = context[0].raw; // Assuming you want to use the first data point
              return `Growth Stage: ${dataPoint.growthStage}, Age: ${dataPoint.x}`;
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
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
          type: "linear",
          min: 0,
          max: curAnimal.species.lifeExpectancyYears * 1.2,
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
          min: 0,
        },
      },
    };
    setWeightChartData(data);
    setWeightChartOptions(options);
  }, [physiologicalRefNormsList, animalWeightList]);

  return (
    <div>
      <div className="my-4 flex justify-start gap-6">
        <NavLink to={`/animal/createweightrecord/${curAnimal.animalCode}`}>
          <Button>Create New Weight Record</Button>
        </NavLink>
      </div>
      <div>
        <AnimalWeightDatatable
          animalWeightList={animalWeightList}
          setAnimalWeightList={setAnimalWeightList}
        />
      </div>
      <div>
        <Chart
          type="line"
          data={weightChartData}
          options={weightChartOptions}
        />
      </div>
    </div>
  );
}

export default AnimalWeightInfo;
