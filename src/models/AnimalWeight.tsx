import Animal from "./Animal";

interface AnimalWeight {
  animalWeightId: number;
  dateOfMeasure: Date;
  weightInKg: number;

  animal?: Animal;
}

export default AnimalWeight;
