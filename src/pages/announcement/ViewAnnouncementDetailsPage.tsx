import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useApiJson from "../../hooks/useApiJson";
import ViewAnnouncementDetails from "../../components/AnnouncementManagement/ViewAnnouncementDetails";
import Announcement from "../../models/Announcement";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function ViewAnnouncementDetailsPage() {
  const apiJson = useApiJson();
  let emptyAnnouncement: Announcement = {
    announcementId: -1,
    title: "",
    content: "",
    isPublished: false,
    scheduledStartPublish: new Date(),
    scheduledEndPublish: new Date(),
  };

  const { announcementId } = useParams<{ announcementId: string }>();
  const [curAnnouncement, setCurAnnouncement] =
    useState<Announcement>(emptyAnnouncement);
  const [refreshSeed, setRefreshSeed] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/announcement/getAnnouncement/${announcementId}`
        );
        setCurAnnouncement(responseJson as Announcement);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchAnnouncement();
  }, [refreshSeed]);

  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-default">
        {curAnnouncement && curAnnouncement.announcementId != -1 && (
          <div className="flex flex-col">
            <div className="flex flex-col">
              <div className="mb-4 flex justify-between">
                <Button
                  variant={"outline"}
                  type="button"
                  onClick={() => navigate(-1)}
                  className=""
                >
                  Back
                </Button>
                <span className="self-center text-lg text-graydark">
                  Announcement Details
                </span>
                <Button disabled className="invisible">
                  Back
                </Button>
              </div>
              <Separator />
              <span className="mt-4 self-center text-title-xl font-bold">
                {curAnnouncement.title}
              </span>
            </div>

            <ViewAnnouncementDetails curAnnouncement={curAnnouncement} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewAnnouncementDetailsPage;
