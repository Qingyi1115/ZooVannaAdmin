import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import EditEnclosureRequirementsForm from "../../components/SpeciesManagement/ViewSpeciesDetailsPage/EditEnclosureRequirementsForm";
import useApiJson from "../../hooks/useApiJson";
import Species from "../../models/Species";
import SpeciesEnclosureNeed from "../../models/SpeciesEnclosureNeed";

function EditEnclosureRequirementsPage() {
  const apiJson = useApiJson();

  const { speciesCode } = useParams<{ speciesCode: string }>();
  const [curSpecies, setCurSpecies] = useState<Species | null>(null);

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

  // check if enclosure need already exists
  const [curEnclosureNeeds, setCurEnclosureNeeds] =
    useState<SpeciesEnclosureNeed | null>(null);
  useEffect(() => {
    const fetchSpeciesEnclosureNeeds = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/species/getEnclosureNeeds/${speciesCode}`
        );
        console.log(responseJson);
        setCurEnclosureNeeds(responseJson as SpeciesEnclosureNeed);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchSpeciesEnclosureNeeds();
  }, []);

  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default dark:border-strokedark">
        {curSpecies && curEnclosureNeeds && (
          <EditEnclosureRequirementsForm
            curSpecies={curSpecies}
            curEnclosureNeeds={curEnclosureNeeds}
          />
        )}
        {curSpecies && curEnclosureNeeds == null && (
          <div className="flex flex-col items-center gap-4">
            <span className="text-center font-medium">
              Enclosure requirements have <span className="font-bold">NOT</span>{" "}
              been created for the current species ({curSpecies.commonName}).
              <br />
              Please create the enclosure requirements first.
            </span>
            <NavLink
              className="w-1/3"
              to={`/species/viewspeciesdetails/${curSpecies.speciesCode}`}
            >
              <Button
                type="button"
                className="h-12 w-full rounded-full px-4 text-lg"
              >
                Click to return to Species Details page
              </Button>
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditEnclosureRequirementsPage;
