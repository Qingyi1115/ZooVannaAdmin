import SpeciesEnclosureNeed from "./SpeciesEnclosureNeed";
import SpeciesDietNeed from "./SpeciesDietNeed";
import PhysiologicalReferenceNorms from "./PhysiologicalReferenceNorms";
interface Species {
  speciesId: number;
  speciesCode: string;
  commonName: string;
  scientificName: string;
  aliasName: string;
  conservationStatus: string;
  domain: string;
  kingdom: string;
  phylum: string;
  speciesClass: string;
  order: string;
  family: string;
  genus: string;
  nativeContinent: string;
  nativeBiomes: string;
  educationalDescription: string;
  educationalFunFact: string;
  groupSexualDynamic: string;
  habitatOrExhibit: string;
  imageUrl: string;
  generalDietPreference: string;
  lifeExpectancyYears: number;

  createdAt?: string;
  updateTimestamp?: string;

  speciesDietNeed?: SpeciesDietNeed;
  speciesEnclosureNeed?: SpeciesEnclosureNeed;
  physiologicalReferenceNorms?: PhysiologicalReferenceNorms;
}

export default Species;
