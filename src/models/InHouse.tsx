import { FacilityType } from "../enums/FacilityType"

interface InHouse {
    ownership: String
    ownerContact: String
    maxAccommodationSize: number
    hasAirCon : Boolean
    facilityType: FacilityType
}

export default InHouse;
