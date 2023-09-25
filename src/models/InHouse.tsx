import { FacilityType } from "../enums/FacilityType"
import FacilityLog from "./FacilityLog"

interface InHouse {
    lastMaintained: Date
    isPaid: Boolean
    maxAccommodationSize: number
    hasAirCon: Boolean
    facilityType: FacilityType
    facilityLogs: FacilityLog[]
}

export default InHouse;
