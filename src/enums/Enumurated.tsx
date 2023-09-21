enum KeeperType {
  SENIOR_KEEPER = "SENIOR_KEEPER",
  KEEPER = "KEEPER",
}

enum PlannerType {
  CURATOR = "CURATOR",
  SALES = "SALES",
  MARKETING="MARKETING",
  OPERATIONS_MANAGER='OPERATIONS_MANAGER',
  CUSTOMER_OPERATIONS='CUSTOMER_OPERATIONS'
}

enum GeneralStaffType {
  ZOO_MAINTENANCE = "ZOO_MAINTENANCE",
  ZOO_OPERATIONS = "ZOO_OPERATIONS",
}

enum FacilityType {
  INFORMATION_CENTRE = "INFORMATION_CENTRE",
  ZOO_DIRECTORY = "ZOO_DIRECTORY",
  AMPHITHEATRE = "AMPHITHEATRE",
  GAZEBO = "GAZEBO",
  AED = "AED",
  RESTROOM = "RESTROOM",
  NURSERY = "NURSERY",
  FIRST_AID = "FIRST_AID",
  BENCHES = "BENCHES",
  PLAYGROUND = "PLAYGROUND",
  TRAMSTOP = "TRAMSTOP",
  PARKING = "PARKING",
}

enum Specialization {
  MAMMAL = "MAMMAL",
  BIRD = "BIRD",
  FISH = "FISH",
  REPTILE = "REPTILE",
  AMPHIBIAN = "AMPHIBIAN",
}

enum MedicalSupplyType {
  FIRST_AID = "FIRST_AID",
  MEDICATION = "MEDICATION",
  DIAGNOSTIC_TOOL = "DIAGNOSTIC_TOOL",
  SURGICAL_TOOL = "SURGICAL_TOOL",
  FLUID_ADMINISTRATION = "FLUID_ADMINISTRATION",
  DENTAL = "DENTAL",
  EMERGENCY = "EMERGENCY",
  FEEDING_TUBE_AND_SYRINGES = "FEEDING_TUBE_AND_SYRINGES",
  LABORATORY = "LABORATORY",
  PPE = "PPE",
}

enum ConservationStatus {
  DATA_DEFICIENT = "DATA_DEFICIENT",
  DOMESTICATED = "DOMESTICATED",
  LEAST_CONCERN = "LEAST_CONCERN",
  NEAR_THREATENED = "NEAR_THREATENED",
  VULNERABLE = "VULNERABLE",
  ENDANGERED = "ENDANGERED",
  CRITICALLY_ENDANGERED = "CRITICALLY_ENDANGERED",
  EXTINCT_IN_WILD = "EXTINCT_IN_WILD",
}

enum Continent {
  AFRICA = "AFRICA",
  ASIA = "ASIA",
  EUROPE = "EUROPE",
  NORTH_AMERICA = "NORTH_AMERICA",
  SOUTH_OR_CENTRAL_AMERICA = "SOUTH_OR_CENTRAL_AMERICA",
  OCEANIA = "OCEANIA",
}

enum GroupSexualDynamic {
  MONOGAMOUS = "MONOGAMOUS",
  PROMISCUOUS = "PROMISCUOUS",
  POLYGYNOUS = "POLYGYNOUS",
  POLYANDROUS = "POLYANDROUS",
}

enum PresentationContainer {
  TEST = "TEST",
}
enum PresentationMethod {
  TEST = "TEST",
}
enum PresentationLocation {
  TEST = "TEST",
}
enum AnimalGrowthState {
  TEST = "TEST",
}

enum AnimalSex {
  MALE = "MALE",
  FEMALE = "FEMALE",
  UNKNOWN = "UNKNOWN",
  ASEXUAL = "ASEXUAL",
}

enum AcquisitionMethod {
  INFANT = "INFANT",
  JUVENILE = "JUVENILE",
  ADOLESCENT = "ADOLESCENT",
  ADULT = "ADULT",
  ELDER = "ELDER",
}

enum AnimalFeedCategory {
  RED_MEAT = "RED_MEAT",
  WHITE_MEAT = "WHITE_MEAT",
  FISH = "FISH",
  INSECTS = "INSECTS",
  HAY = "HAY",
  VEGETABLES = "VEGETABLES",
  FRUITS = "FRUITS",
  GRAINS = "GRAINS",
  BROWSE = "BROWSE",
  PELLETS = "PELLETS",
  NECTAR = "NECTAR",
  SUPPLEMENTS = "SUPPLEMENTS",
  OTHERS = "OTHERS"
}

enum AnimalGrowthStage {
  CAPTIVE_BRED = "CAPTIVE_BRED",
  WILD_CAPTURED = "WILD_CAPTURED",
  TRANSFERRED_IN = "TRANSFERRED_IN",
}

enum AnimalStatusType {
  TEST = "TEST",
}

enum Biome {
  AQUATIC = "AQUATIC",
  DESERT = "DESERT",
  GRASSLAND = "GRASSLAND",
  TAIGA = "TAIGA",
  TEMPERATE = "TEMPERATE",
  TROPICAL = "TROPICAL",
  TUNDRA = "TUNDRA",
}

enum EventType {
  SHOW = "SHOW",
  CUSTOMER_FEEDING = "CUSTOMER_FEEDING",
  TALK = "TALK",
  EMPLOYEE_FEEDING = "EMPLOYEE_FEEDING",
  ENRICHMENT = "ENRICHMENT",
  OBSERVATION = "OBSERVATION",
  ANIMAL_CHECKUP = "ANIMAL_CHECKUP",
}

enum EventTimingType {
  MORNING = "MORNING",
  AFTERNOON = "AFTERNOON",
  EVENING = "EVENING",
}

enum ListingType {
  LOCAL_ADULT_ONETIME = "LOCAL_ADULT_ONETIME",
  LOCAL_STUDENT_ONETIME = "LOCAL_STUDENT_ONETIME",
  LOCAL_SENIOR_ONETIME = "LOCAL_SENIOR_ONETIME",
  FOREIGNER_ONETIME = "FOREIGNER_ONETIME",
  ANNUALPASS = "ANNUALPASS"
}

enum ListingStatus {
  ACTIVE = "ACTIVE",
  DISCONTINUED = "DISCONTINUED"
}

enum PaymentStatus {
  SUCCESSFUL = "SUCCESSFUL",
  FAILED = "FAILED"
}

enum PaymentType {
  VISA = "VISA",
  MASTERCARD = "MASTERCARD",
  PAYNOW = "PAYNOW"
}

enum OrderStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED"
}

enum EnclosureStatus {
  ACTIVE = "ACTIVE",
  CLOSED = "CLOSED",
  CONSTRUCTING = "CONSTRUCTING"
}

enum HubStatus{
  PENDING="PENDING",
  DISCONNECTED="DISCONNECTED",
  CONNECTED="CONNECTED"
}

export {
  KeeperType,
  PlannerType,
  GeneralStaffType,
  FacilityType,
  Specialization,
  MedicalSupplyType,
  ConservationStatus,
  Continent,
  GroupSexualDynamic,
  PresentationContainer,
  PresentationMethod,
  PresentationLocation,
  AnimalFeedCategory,
  AnimalGrowthState,
  AnimalSex,
  AcquisitionMethod,
  AnimalGrowthStage,
  AnimalStatusType,
  Biome,
  EventType,
  EventTimingType,
  ListingType,
  ListingStatus,
  PaymentStatus,
  PaymentType,
  OrderStatus,
  EnclosureStatus,
  HubStatus
};
