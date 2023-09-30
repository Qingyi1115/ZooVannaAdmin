import React, { useState, useEffect } from "react";
import useApiJson from "../../hooks/useApiJson";
import Species from "../../models/Species";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NavLink, useParams } from "react-router-dom";

function ViewPopulationDetailsPage() {
  const apiJson = useApiJson();

  const { speciesCode } = useParams<{ speciesCode: string }>();

  const [curSpecies, setCurSpecies] = useState<Species>();

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
            {/* {curSpecies.commonName} */}
          </span>
        </div>
        <div>
          <span className="font-bold">Population Basic Information</span>
          <ul>
            <li>Total population</li>
            <li>Sex distribution</li>
            <li>Average age</li>
            <li>Exact age distribution, use a graph maybe</li>
          </ul>
        </div>
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
        <div>
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
        </div>
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
