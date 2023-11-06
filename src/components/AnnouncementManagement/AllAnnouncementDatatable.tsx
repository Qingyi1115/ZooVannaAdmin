import { Toast } from "primereact/toast";
import React, { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import useApiJson from "../../hooks/useApiJson";
import Announcement from "src/models/Announcement";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import { NavLink } from "react-router-dom";
import {
  HiBan,
  HiCheck,
  HiEye,
  HiOutlinePlay,
  HiPencil,
  HiPlay,
  HiPlus,
  HiTrash,
  HiX,
} from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog } from "primereact/dialog";
import { Separator } from "@/components/ui/separator";
import { FiPlay } from "react-icons/fi";
import moment from "moment";

{
  /*const toast = useRef<Toast>(null);*/
}

function AllAnnouncementsDatatable() {
  const apiJson = useApiJson();

  let announcement: Announcement = {
    announcementId: -1,
    title: "",
    content: "",
    isPublished: false,
    scheduledStartPublish: new Date(),
    scheduledEndPublish: new Date(),
  };

  const toast = useRef<Toast>(null);
  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const [announcementList, setAnnouncementList] = useState<Announcement[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement>(announcement);
  const dt = useRef<DataTable<Announcement[]>>(null);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [announcementDisableDialog, setannouncementDisableDialog] =
    useState<boolean>(false);
  const toastShadcn = useToast().toast;
  const [disable, setDisable] = useState<boolean>();
  let [count, setCount] = useState<number | null>(null);
  const isInitialRender = useRef(true);

  const fetchannouncements = async () => {
    try {
      const responseJson = await apiJson.get(
        "http://localhost:3000/api/announcement/getAllAnnouncements"
      );

      setAnnouncementList(responseJson as Announcement[]);
      console.log("Here " + responseJson);
      const help = responseJson as Announcement[];
      console.log(help);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("inside use effect");
    fetchannouncements();
  }, []);

  const hideannouncementDisableDialog = () => {
    setannouncementDisableDialog(false);
  };

  const disableAnnouncement = () => {
    hideannouncementDisableDialog();
    console.log(selectedAnnouncement);
    apiJson
      .del(
        `http://localhost:3000/api/announcement/togglePublishAnnouncement/${selectedAnnouncement.announcementId}`
      )
      .catch((error) =>
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while disabling announcement: \n" + error,
        })
      )
      .then(() => {
        toastShadcn({
          // variant: "destructive",
          title: "Disable Successful",
          description:
            "Successfully disabled announcement: " + selectedAnnouncement.title,
        });
        fetchannouncements();
      });
  };

  const enableAnnouncement = () => {
    hideannouncementDisableDialog();
    console.log(selectedAnnouncement);
    apiJson
      .del(
        `http://localhost:3000/api/announcement/togglePublishAnnouncement/${selectedAnnouncement.announcementId}`
      )
      .catch((error) =>
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while enabling announcement: \n" + error,
        })
      )
      .then(() => {
        toastShadcn({
          // variant: "destructive",
          title: "Enable Successful",
          description:
            "Successfully enabled announcement: " + selectedAnnouncement.title,
        });
        fetchannouncements();
      });
  };

  //   useEffect(() => {
  //     if (isInitialRender.current) {
  //       isInitialRender.current = true;
  //       return;
  //     }
  //     if (disable) {
  //       console.log(selectedAnnouncement);
  //       apiJson
  //         .del(
  //           `http://localhost:3000/api/announcement/togglePublishAnnouncement/${selectedAnnouncement.announcementId}`
  //         )
  //         .catch((error) =>
  //           toastShadcn({
  //             variant: "destructive",
  //             title: "Uh oh! Something went wrong.",
  //             description:
  //               "An error has occurred while disabling announcement: \n" + error,
  //           })
  //         )
  //         .then(() => {
  //           toastShadcn({
  //             // variant: "destructive",
  //             title: "Disable Successful",
  //             description:
  //               "Successfully disabled announcement: " +
  //               selectedAnnouncement.title,
  //           });
  //           setannouncementDisableDialog(false);
  //           fetchannouncements();
  //         });
  //     } else {
  //       console.log(selectedAnnouncement);
  //       apiJson
  //         .del(
  //           `http://localhost:3000/api/announcement/togglePublishAnnouncement/${selectedAnnouncement.announcementId}`
  //         )
  //         .catch((error) =>
  //           toastShadcn({
  //             variant: "destructive",
  //             title: "Uh oh! Something went wrong.",
  //             description:
  //               "An error has occurred while enabling announcement: \n" + error,
  //           })
  //         )
  //         .then(() => {
  //           toastShadcn({
  //             // variant: "destructive",
  //             title: "Enable Successful",
  //             description:
  //               "Successfully enabled announcement: " +
  //               selectedAnnouncement.title,
  //           });
  //           fetchannouncements();
  //         });
  //     }
  //   }, [count, disable]);

  {
    /*const disableAnnouncement = async () => {
    const selectedannouncementName = selectedAnnouncement.name;
    console.log(selectedAnnouncement);

    const disable = async () => {
      try {
        const responseJson = await apiJson.del(
          `http://localhost:3000/api/announcement/disableAnnouncement/${selectedAnnouncement.announcementId}`
        );

        toastShadcn({
          // variant: "destructive",
          title: "Deletion Successful",
          description: "Successfully disabled announcement: " + selectedannouncementName,
        });

        setSelectedAnnouncement(announcement);
        console.log("here");
        setannouncementDisableDialog(false);
        window.location.reload();
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while disabling announcement: \n" + apiJson.error,
        });
      }
    };
    disable();
  };*/
  }

  {
    /*const enableAnnouncement = async (announcement: Announcement) => {
    const enable = async () => {
      try {
        console.log(announcement);
        const responseJson = await apiJson.del(
          `http://localhost:3000/api/announcement/enableAnnouncement/${announcement.announcementId}`
        );

        toastShadcn({
          // variant: "destructive",
          title: "Enable Successful",
          description: "Successfully enabled announcement: " + announcement.name,
        });
        setSelectedAnnouncement(announcement);
        window.location.reload();
        console.log(announcement);
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while enabling announcement: \n" + apiJson.error,
        });
      }
    };
    enable();
  };*/
  }
  function convertUtcToTimezone(utcDate: Date, targetTimezone: string): string {
    const utcMoment = moment.utc(utcDate);
    const targetMoment = utcMoment.tz(targetTimezone);
    const formattedTime: string = targetMoment.format("DD MMM YYYY");
    return formattedTime;
  }

  const announcementDisableDialogFooter = (
    <React.Fragment>
      <Button onClick={hideannouncementDisableDialog}>
        <HiX />
        No
      </Button>
      <Button variant={"destructive"} onClick={disableAnnouncement}>
        <HiCheck />
        Yes
      </Button>
    </React.Fragment>
  );

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-1">Manage Announcements</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          placeholder="Search..."
          onInput={(e) => {
            const target = e.target as HTMLInputElement;
            setGlobalFilter(target.value);
          }}
        />
      </span>
    </div>
  );

  const confirmannouncementDisable = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setannouncementDisableDialog(true);
  };

  const confirmannouncementEnable = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    enableAnnouncement();
  };

  const actionBodyTemplate = (announcement: Announcement) => {
    return (
      <div className="">
        <NavLink
          to={`/announcement/viewannouncement/${announcement.announcementId}`}
          className="mr-1"
        >
          <Button>
            <HiEye />
          </Button>
        </NavLink>
        <NavLink
          to={`/announcement/editannouncement/${announcement.announcementId}`}
          className="mr-1"
        >
          <Button>
            <HiPencil />
          </Button>
        </NavLink>
        {!announcement.isPublished ? (
          <Button onClick={() => confirmannouncementEnable(announcement)}>
            <FiPlay />
          </Button>
        ) : (
          <Button
            variant={"destructive"}
            onClick={() => confirmannouncementDisable(announcement)}
          >
            <HiBan className="" />
          </Button>
        )}
      </div>
    );
  };

  return (
    <div>
      <div>
        <Toast ref={toast} />
        <div className="flex flex-col">
          <div className="mb-4 flex justify-between">
            <NavLink to={"/announcement/createnewannouncement"}>
              <Button className="mr-2">
                <HiPlus className="mr-auto" />
                Add Announcement
              </Button>
            </NavLink>
            <Button onClick={exportCSV}>Export to .csv</Button>
          </div>
          <Separator />
        </div>
        <div>
          <DataTable
            ref={dt}
            value={announcementList}
            selection={selectedAnnouncement}
            onSelectionChange={(e) => {
              if (Array.isArray(e.value)) {
                setSelectedAnnouncement(e.value);
              }
            }}
            dataKey="announcementId"
            paginator
            rows={10}
            scrollable
            selectionMode={"single"}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} announcements"
            globalFilter={globalFilter}
            header={header}
          >
            <Column
              field="title"
              header="Title"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="content"
              header="Content"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="isPublished"
              header="Published?"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              body={(announcement) => {
                const utcDate = new Date(announcement.scheduledStartPublish);
                const singaporeTime = convertUtcToTimezone(
                  utcDate,
                  "Asia/Singapore"
                );

                return singaporeTime;
              }}
              field="scheduledStartPublish"
              header="Publish Date"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              body={(announcement) => {
                const utcDate = new Date(announcement.scheduledEndPublish);
                const singaporeTime = convertUtcToTimezone(
                  utcDate,
                  "Asia/Singapore"
                );

                return singaporeTime;
              }}
              field="scheduledEndPublish"
              header="End Date"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>

            <Column
              body={actionBodyTemplate}
              header="Actions"
              exportable={false}
              frozen
              alignFrozen="right"
              style={{ minWidth: "12rem" }}
            ></Column>
          </DataTable>
        </div>
        <Dialog
          visible={announcementDisableDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Confirm"
          modal
          footer={announcementDisableDialogFooter}
          onHide={hideannouncementDisableDialog}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem" }}
            />
            {selectedAnnouncement && (
              <span>
                Are you sure you want to disable{" "}
                <b>{selectedAnnouncement.title}</b>?
              </span>
            )}
          </div>
        </Dialog>
      </div>
    </div>
  );
}

export default AllAnnouncementsDatatable;
