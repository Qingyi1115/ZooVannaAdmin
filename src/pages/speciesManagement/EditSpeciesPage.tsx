import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import EditSpeciesForm from "../../components/SpeciesManagement/EditSpeciesPage/EditSpeciesForm";
import useApiJson from "../../hooks/useApiJson";
import Species from "../../models/Species";

function EditSpeciesPage() {
  const apiJson = useApiJson();

  let emptySpecies: Species = {
    speciesId: -1,
    speciesCode: "",
    commonName: "",
    scientificName: "",
    aliasName: "",
    conservationStatus: "",
    domain: "",
    kingdom: "",
    phylum: "",
    speciesClass: "",
    order: "",
    family: "",
    genus: "",
    nativeContinent: "",
    nativeBiomes: "",
    educationalDescription: "",
    groupSexualDynamic: "",
    habitatOrExhibit: "habitat",
    imageUrl: "",
    generalDietPreference: "",
  };

  const { speciesId } = useParams<{ speciesId: string }>();
  const [curSpecies, setCurSpecies] = useState<Species>(emptySpecies);

  useEffect(() => {
    apiJson.get("");
  }, []);

  useEffect(() => {
    const species = apiJson.result as Species;
    setCurSpecies(emptySpecies);
  }, [apiJson.loading]);

  return (
    <div className="p-10">
      <EditSpeciesForm curSpecies={curSpecies} />
    </div>
  );
}

export default EditSpeciesPage;
