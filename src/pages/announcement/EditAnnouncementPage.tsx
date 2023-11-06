import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import useApiJson from "../../hooks/useApiJson";
import Announcement from "src/models/Announcement";
import EditAnnouncementForm from "../../components/AnnouncementManagement/EditAnnouncementForm";

function EditAnnouncementPage() {
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
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/announcement/getAnnouncement/${announcementId}`
        );
        setCurAnnouncement(responseJson as Announcement);
        let announcement = responseJson as Announcement;

        if (!announcement.isPublished) {
          setStatus("DISABLED");
        } else if (announcement.scheduledStartPublish > new Date()) {
          setStatus("UPCOMING");
        } else if (announcement.scheduledEndPublish < new Date()) {
          setStatus("EXPIRED");
        } else {
          setStatus("PUBLISHED");
        }
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchAnnouncement();
  }, [refreshSeed]);

  return (
    <div className="p-10">
      {curAnnouncement && curAnnouncement.announcementId != -1 && (
        <EditAnnouncementForm
          currAnnouncement={curAnnouncement}
          refreshSeed={refreshSeed}
          setRefreshSeed={setRefreshSeed}
          status={status}
        />
      )}
    </div>
  );
}

export default EditAnnouncementPage;
