import React from "react";
import AllAnnouncementsDatatable from "../../components/AnnouncementManagement/AllAnnouncementDatatable";

function ViewAllAnnouncementsPage() {
  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-10 text-black shadow-default">
        <span className="self-center text-title-xl font-bold">
          All Announcements
        </span>
        <AllAnnouncementsDatatable />
      </div>
    </div>
  );
}

export default ViewAllAnnouncementsPage;
