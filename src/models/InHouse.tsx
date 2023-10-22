import { FacilityType } from "../enums/FacilityType"
import Facility from "./Facility"
import FacilityLog from "./FacilityLog"

interface InHouse {
    lastMaintained: Date
    isPaid: Boolean
    maxAccommodationSize: number
    hasAirCon: Boolean
    facilityType: FacilityType
    facilityLogs: FacilityLog[]
    facility: Facility
}

export default InHouse;
