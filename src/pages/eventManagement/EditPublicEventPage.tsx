import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useApiJson from "../../hooks/useApiJson";
import PublicEvent from "../../models/PublicEvent";
import EditPublicEventForm from "../../components/EventManagement/EditPublicEventForm";

function EditPublicEventPage() {
  const apiJson = useApiJson();

  const { publicEventId } = useParams<{ publicEventId: string }>();
  const [curPublicEvent, setCurPublicEvent] =
    useState<PublicEvent | null>(null);

  useEffect(() => {
    const fetchPublicEvent = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/zooEvent/getPublicEventById/${publicEventId}`
        );
        console.log("EditPublicEventPage", responseJson)
        setCurPublicEvent(responseJson.publicEvent);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchPublicEvent();
  }, []);

  return (
    <div className="p-10">
      {curPublicEvent && curPublicEvent.publicEventId != -1 && (
        <EditPublicEventForm
          curPublicEvent={curPublicEvent}
        />
      )}
    </div>
  );
}

export default EditPublicEventPage;
