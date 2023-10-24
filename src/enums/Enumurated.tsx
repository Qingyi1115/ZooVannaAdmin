enum KeeperType {
  SENIOR_KEEPER = "SENIOR_KEEPER",
  KEEPER = "KEEPER",
}

enum ActivityType {
  TRAINING = "TRAINING",
  ENRICHMENT = "ENRICHMENT",
}

enum PlannerType {
  CURATOR = "CURATOR",
  SALES = "SALES",
  MARKETING = "MARKETING",
  OPERATIONS_MANAGER = "OPERATIONS_MANAGER",
  CUSTOMER_OPERATIONS = "CUSTOMER_OPERATIONS",
}

enum GeneralStaffType {
  ZOO_MAINTENANCE = "ZOO_MAINTENANCE",
  ZOO_OPERATIONS = "ZOO_OPERATIONS",
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
  STAINLESS_STEEL_BOWL = "Stainless Steel Bowls",
  PLASTIC_DISH = "Plastic Feeding Dishes",
  SILICONE_DISH = "Silicone Dishes",
  MESH_BAG = "Mesh Bags",
  FREEZE_RESISTANT_CONTAINER = "Freeze-Resistant Containers",
  AUTOMATIC_FEEDER = "Automatic Feeders",
  HANGING_FEEDERS = "Hanging Feeder",
  NET = "Net",
}
enum PresentationMethod {
  CHOPPED = "CHOPPED",
  FROEZEN = "FROEZEN",
  MASHED = "MASHED",
  DICED = "DICED",
  WHOLE = "WHOLE",
  BLENDED = "BLENDED",
  PUZZLE = "PUZZLE",
}
enum PresentationLocation {
  SCATTER = "SCATTER",
  DANGLING = "DANGLING",
  ROOF = "ROOF",
  BURIED = "BURIED",
  IMPALED = "IMPALED",
  IN_CONTAINER = "IN_CONTAINER",
}
enum AnimalGrowthState {
  TEST = "TEST",
}

enum AnimalSex {
  MALE = "MALE",
  FEMALE = "FEMALE",
  UNKNOWN = "UNKNOWN",
  ASEXUAL = "ASEXUAL",
  NOT_APPLICABLE = "NOT APPLICABLE",
}

enum AcquisitionMethod {
  INHOUSE_CAPTIVE_BRED = "INHOUSE CAPTIVE BRED",
  PRIVATELY_BRED = "PRIVATELY BRED",
  FROM_THE_WILD = "FROM THE WILD",
  TRANSFERRED_FROM_ANOTHER_ZOO = "TRANSFERRED FROM ANOTHER ZOO",
}

enum AnimalFeedCategory {
  RED_MEAT = "RED MEAT",
  WHITE_MEAT = "WHITE MEAT",
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
  OTHERS = "OTHERS",
}

enum AnimalGrowthStage {
  INFANT = "INFANT",
  JUVENILE = "JUVENILE",
  ADOLESCENT = "ADOLESCENT",
  ADULT = "ADULT",
  ELDER = "ELDER",
  UNKNOWN = "UNKNOWN",
}

enum AnimalStatusType {
  TEST = "TEST",
}

enum AnimalStatus {
  NORMAL = "NORMAL",
  PREGNANT = "PREGNANT",
  SICK = "SICK",
  INJURED = "INJURED",
  OFFSITE = "OFFSITE",
  RELEASED = "RELEASED",
  DECEASED = "DECEASED",
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

enum IdentifierType {
  NONE = "None",
  RFID_TAG = "RFID Tag",
  MAGNETIC_TAG = "Magnetic Tag",
  BARCODE_TAG = "Barcode Tag",
  EAR_TAG = "Ear Tag",
  COLLAR = "Collar",
  TATTOOS = "Tattoos",
  COLORED_BAND = "Colored Band",
  BRACELETS_ANKLETS = "Bracelets/Anklets",
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

enum FoodUnit {
  KG = "KG",
  GRAM = "GRAM",
  ML = "ML",
  L = "L",
}

enum ListingType {
  LOCAL_ADULT_ONETIME = "LOCAL_ADULT_ONETIME",
  LOCAL_STUDENT_ONETIME = "LOCAL_STUDENT_ONETIME",
  LOCAL_SENIOR_ONETIME = "LOCAL_SENIOR_ONETIME",
  FOREIGNER_ONETIME = "FOREIGNER_ONETIME",
  ANNUALPASS = "ANNUALPASS",
}

enum ListingStatus {
  ACTIVE = "ACTIVE",
  DISCONTINUED = "DISCONTINUED",
}

enum PaymentStatus {
  SUCCESSFUL = "SUCCESSFUL",
  FAILED = "FAILED",
}

enum PaymentType {
  VISA = "VISA",
  MASTERCARD = "MASTERCARD",
  PAYNOW = "PAYNOW",
}

enum OrderStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
}

enum EnclosureStatus {
  ACTIVE = "ACTIVE",
  CLOSED = "CLOSED",
  CONSTRUCTING = "CONSTRUCTING",
}

enum HubStatus {
  PENDING = "PENDING",
  DISCONNECTED = "DISCONNECTED",
  CONNECTED = "CONNECTED",
}

enum DayOfWeek {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

enum RepeatPattern {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  ANUALLY = "ANUALLY",
}

enum RecurringPattern {
  NON_RECURRING = "NON-RECURRING",
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
}

export {
  KeeperType,
  PlannerType,
  GeneralStaffType,
  Specialization,
  ActivityType,
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
  AnimalStatus,
  Biome,
  EventType,
  EventTimingType,
  FoodUnit,
  ListingType,
  ListingStatus,
  PaymentStatus,
  PaymentType,
  OrderStatus,
  EnclosureStatus,
  HubStatus,
  DayOfWeek,
  RepeatPattern,
  RecurringPattern,
  IdentifierType,
};
