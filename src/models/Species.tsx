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
  groupSexualDynamic: string;
  habitatOrExhibit: string;
  imageUrl: string;
  generalDietPreference: string;

  createdAt?: string;
  updateTimestamp?: string;
}

export default Species;
