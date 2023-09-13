interface Species {
  speciesId: number;
  speciesCode: string;
  commonName: string;
  scientificName: string;
  aliasName: string;
  //   conservationStatus: ConservationStatus;
  domain: string;
  kingdom: string;
  phylum: string;
  speciesClass: string;
  order: string;
  family: string;
  genus: string;
  //   nativeContinent: Continent;
  nativeBiome: string;
  educationalDescription: string;
  //   groupSexualDynamic: GroupSexualDynamic;
  isBigHabitatSpecies: Boolean;
  imageUrl: string;
  generalDietPreference: string;
}
