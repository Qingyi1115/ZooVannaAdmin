import { FacilityType } from "../enums/FacilityType"

interface InHouse {
    lastMaintained : Date
    isPaid: Boolean
    maxAccommodationSize: number
    hasAirCon: Boolean
    facilityType: FacilityType
}

export default InHouse;
