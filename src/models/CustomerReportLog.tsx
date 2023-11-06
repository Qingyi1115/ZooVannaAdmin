import InHouse from "./InHouse";
import ThirdParty from "./ThirdParty";

interface CustomerReportLog {
    customerReportLogId: number;
    dateTime: Date;
    title: string;
    remarks: string;
    viewed: Boolean;

    // Foreign keys
    inHouse: InHouse | null;
    thirdParty: ThirdParty | null;

}
export default CustomerReportLog;