import {
    Table,
    TableBody,
    TableCell,
    TableRow
} from "@/components/ui/table";
import beautifyText from "../../../../hooks/beautifyText";
import ThirdParty from "../../../../models/ThirdParty";

interface ThirdPartyProps {
    curThirdParty: ThirdParty;
}
function ViewThirdPartyDetails(props: ThirdPartyProps) {
    const { curThirdParty } = props;
    return (
        <div className="">
            <Table>
                {/* <TableHeader className=" bg-whiten">
                <TableRow>
                <TableHead className="w-1/3 font-bold" colSpan={2}>
                    Attribute
                </TableHead>
                <TableHead>Value</TableHead>
                </TableRow>
            </TableHeader> */}
                <TableBody>
                    <TableRow>
                        <TableCell className="w-1/3 font-bold" colSpan={2}>
                            Owner
                        </TableCell>
                        <TableCell>{curThirdParty.ownership}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="w-1/3 font-bold" colSpan={2}>
                            Contact
                        </TableCell>
                        <TableCell>{curThirdParty.ownerContact}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="w-1/3 font-bold" colSpan={2}>
                            Maximum Accommodation Size
                        </TableCell>
                        <TableCell>{curThirdParty.maxAccommodationSize}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="w-1/3 font-bold" colSpan={2}>
                            Air conditioned avaliable
                        </TableCell>
                        <TableCell>{String(curThirdParty.hasAirCon) == "false" ? "No" : "Yes"}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="w-1/3 font-bold" colSpan={2}>
                            Type
                        </TableCell>
                        <TableCell>{beautifyText(curThirdParty.facilityType)}</TableCell>
                    </TableRow>

                </TableBody>
            </Table>
        </div>
    )
}

export default ViewThirdPartyDetails;