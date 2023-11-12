import { useToast } from "@/components/ui/use-toast";
import * as moment from "moment-timezone";
import useApiJson from "../../hooks/useApiJson";
import Announcement from "../../models/Announcement";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

interface AnnouncementInfoDetailsProps {
  curAnnouncement: Announcement;
}
function ViewAnnouncementDetails(props: AnnouncementInfoDetailsProps) {
  const apiJson = useApiJson();
  const { curAnnouncement } = props;
  console.log(props);
  const toastShadcn = useToast().toast;

  function convertUtcToTimezone(utcDate: Date, targetTimezone: string): string {
    const utcMoment = moment.utc(utcDate);
    const targetMoment = utcMoment.tz(targetTimezone);
    const formattedTime: string = targetMoment.format("DD MMM YYYY  HH:mm");
    const timestampWithSuffix: string = `${formattedTime} SGT`;
    return timestampWithSuffix;
  }

  return (
    <div className="mt-4">
      <div className="overflow-hidden rounded-lg border border-strokedark/40 lg:mx-20">
        <Table>
          <TableHeader className=" bg-whiten">
            <TableRow>
              <TableHead className="w-3/3 font-bold" colSpan={3}>
                Announcement Details
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="w-1/3 font-bold" colSpan={2}>
                Title
              </TableCell>
              <TableCell>{curAnnouncement.title}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="w-1/3 font-bold" colSpan={2}>
                Content
              </TableCell>
              <TableCell>{curAnnouncement.content}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="w-1/3 font-bold" colSpan={2}>
                Published?
              </TableCell>
              <TableCell>{curAnnouncement.isPublished.toString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="w-1/3 font-bold" colSpan={2}>
                Publish Date
              </TableCell>
              <TableCell>
                {convertUtcToTimezone(
                  curAnnouncement.scheduledStartPublish,
                  "Asia/Singapore"
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="w-1/3 font-bold" colSpan={2}>
                End Date
              </TableCell>
              <TableCell>
                {convertUtcToTimezone(
                  curAnnouncement.scheduledEndPublish,
                  "Asia/Singapore"
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default ViewAnnouncementDetails;
