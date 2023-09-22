import { FacilityType } from "../enums/FacilityType"

interface ThirdParty {
    ownership: String
    ownerContact: String
    maxAccommodationSize: number
    hasAirCon : Boolean
    facilityType: FacilityType
}

export default ThirdParty;
