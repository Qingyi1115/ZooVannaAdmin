import React, { useState, useEffect } from "react";
import useApiJson from "../../hooks/useApiJson";
import Species from "../../models/Species";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NavLink, useParams } from "react-router-dom";
import Animal from "../../models/Animal";
import AnimalsBySpeciesDatatable from "../../components/AnimalManagement/ViewPopulationDetailsPage.tsx/AnimalsBySpeciesDatatable";

import { Chart } from "primereact/chart";
import {
  AcquisitionMethod,
  AnimalGrowthStage,
  AnimalSex,
} from "../../enums/Enumurated";

function ViewPopulationDetailsPage() {
  const apiJson = useApiJson();

  const { speciesCode } = useParams<{ speciesCode: string }>();

  const [curSpecies, setCurSpecies] = useState<Species>();
  const [curAnimalList, setCurAnimalList] = useState<Animal[]>([]);

  const [sexChartData, setSexChartData] = useState({});
  const [sexChartOptions, setSexChartOptions] = useState({});
  const [ageChartData, setAgeChartData] = useState({});
  const [ageChartOptions, setAgeChartOptions] = useState({});

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/species/getspecies/${speciesCode}`
        );
        setCurSpecies(responseJson as Species);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchSpecies();
  }, []);

  useEffect(() => {
    const fetchAnimalsBySpecies = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/animal/getAllAnimalsBySpeciesCode/${speciesCode}`
        );
        setCurAnimalList(responseJson as Animal[]);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchAnimalsBySpecies();
  }, []);

  // sex distributiton chart
  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const numMale = curAnimalList.reduce((count, animal) => {
      if (animal.sex === "MALE") {
        return count + 1;
      }
      return count;
    }, 0);
    const numFemale = curAnimalList.reduce((count, animal) => {
      if (animal.sex === "FEMALE") {
        return count + 1;
      }
      return count;
    }, 0);
    const numAsexual = curAnimalList.reduce((count, animal) => {
      if (animal.sex === "ASEXUAL") {
        return count + 1;
      }
      return count;
    }, 0);
    const numUnknown = curAnimalList.reduce((count, animal) => {
      if (animal.sex === "UNKNOWN") {
        return count + 1;
      }
      return count;
    }, 0);
    console.log("numMale: " + numMale);
    console.log("numFemale: " + numFemale);
    console.log("numAsexual: " + numAsexual);
    console.log("numUnknown: " + numUnknown);
    const data = {
      labels: [
        `Male: ${numMale}`,
        `Female: ${numFemale}`,
        `Asexual: ${numAsexual}`,
        `Unknown: ${numUnknown}`,
      ],
      datasets: [
        {
          data: [numMale, numFemale, numAsexual, numUnknown],
          backgroundColor: [
            "#3b82f6",
            "#ec4899",
            documentStyle.getPropertyValue("--yellow-500"),
            documentStyle.getPropertyValue("--gray-500"),
          ],
          hoverBackgroundColor: [
            "#3b82f690",
            "#ec489990",
            documentStyle.getPropertyValue("--yellow-400"),
            documentStyle.getPropertyValue("--gray-400"),
          ],
          label: "Number of individuals",
        },
      ],
    };
    const options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
          },
          position: "right",
        },
      },
    };

    setSexChartData(data);
    setSexChartOptions(options);
  }, [curAnimalList]);

  // age distribution chart
  useEffect(() => {
    const numInfant = curAnimalList.reduce((count, animal) => {
      if (animal.growthStage === "INFANT") {
        return count + 1;
      }
      return count;
    }, 0);
    const numJuvenile = curAnimalList.reduce((count, animal) => {
      if (animal.growthStage === "JUVENILE") {
        return count + 1;
      }
      return count;
    }, 0);
    const numAdolescent = curAnimalList.reduce((count, animal) => {
      if (animal.growthStage === "ADOLESCENT") {
        return count + 1;
      }
      return count;
    }, 0);
    const numAdult = curAnimalList.reduce((count, animal) => {
      if (animal.growthStage === "ADULT") {
        return count + 1;
      }
      return count;
    }, 0);
    const numElder = curAnimalList.reduce((count, animal) => {
      if (animal.growthStage === "ELDER") {
        return count + 1;
      }
      return count;
    }, 0);
    const numUnknown = curAnimalList.reduce((count, animal) => {
      if (animal.growthStage === "UNKNOWN") {
        return count + 1;
      }
      return count;
    }, 0);
    const data = {
      labels: ["INFANT", "JUVENILE", "ADOLESCENT", "ADULT", "ELDER", "UNKNOWN"],
      datasets: [
        {
          label: "Age Distribution by Growth Stage",
          data: [
            numInfant,
            numJuvenile,
            numAdolescent,
            numAdult,
            numElder,
            numUnknown,
          ],
          backgroundColor: [
            "rgba(255, 159, 64, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 99, 132, 0.2)",
            "rgba(169, 169, 169, 0.2)",
          ],
          borderColor: [
            "rgb(255, 159, 64)",
            "rgb(75, 192, 192)",
            "rgb(54, 162, 235)",
            "rgb(153, 102, 255)",
            "rgb(255, 99, 132)",
            "rgb(169, 169, 169)",
          ],
          borderWidth: 1,
        },
      ],
    };
    const options = {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      ticks: {
        stepSize: 1,
      },
    };

    setAgeChartData(data);
    setAgeChartOptions(options);
  }, [curAnimalList]);

  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-lg">
        <div className="flex flex-col">
          <div className="mb-4 flex justify-between">
            <NavLink className="flex" to={`/animal/viewallanimals/`}>
              <Button variant={"outline"} type="button" className="">
                Back
              </Button>
            </NavLink>
            <span className="self-center text-lg text-graydark">
              Population Details
            </span>
            <Button disabled className="invisible">
              Back
            </Button>
          </div>
          <Separator />
          <span className="mt-4 self-center text-title-xl font-bold">
            {curSpecies?.commonName}
          </span>
        </div>
        <div>
          <span className="text-xl font-bold">
            Total Current Population: {curAnimalList.length}
          </span>
        </div>
        <div>
          <AnimalsBySpeciesDatatable
            curAnimalList={curAnimalList}
            setCurAnimalList={setCurAnimalList}
          />
        </div>
        <div>
          <span className="text-lg font-bold">Sex Distribution</span>
          <br />
          <span>(Number of individuals)</span>
          <Chart
            type="pie"
            data={sexChartData}
            options={sexChartOptions}
            className="w-1/3"
          />
        </div>
        <div>
          <span className="text-lg font-bold">Age Distribution</span>
          <br />
          <span>(Number of individuals)</span>
          <Chart
            type="bar"
            data={ageChartData}
            options={ageChartOptions}
            className="w-1/2"
          />
        </div>
        <ul>
          <li>Average age</li>
        </ul>
        <div>
          <span className="font-bold">Feeding Plan</span>
          <br />
          <span>
            Access feeding plans and logs here (since one feeding plan can be
            for multiple individuals),
            <br />
            Feeding plans can be accessed from animal details page too of course
          </span>
        </div>
        <div>
          <span className="font-bold">Training and Enrichment Plan</span>
          <br />
          <span>
            Access training and enrichment plans and logs here???
            <br />
            Feeding plans can be accessed from animal details page too of course
          </span>
        </div>
        {/* <div>
          <span className="font-bold">Weight Information</span>
          <br />
          <span>
            Show the graph, with the physio ref norm line, and current weights
            (in kg) of all individuals as data points
          </span>
        </div>
        <div>
          <span className="font-bold">Size Information</span>
          <br />
          <span>
            Show the graph, with the physio ref norm line, and current size (in
            cm) of all individuals as data points
          </span>
        </div> */}
        <div>
          <span className="font-bold">Previously Owned Individuals</span>
          <br />
          <span>
            Datatable for individuals that used to stay in the zoo, but are not
            here because they were transferred out or dieded
          </span>
        </div>
      </div>
    </div>
  );
}

export default ViewPopulationDetailsPage;
