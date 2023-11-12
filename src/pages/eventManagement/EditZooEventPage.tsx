import { useEffect, useState } from "react";
import { useParams } from "react-router";
import EditEventForm from "../../components/EventManagement/EditZooEventPage/EditZooEventForm";
import useApiJson from "../../hooks/useApiJson";
import ZooEvent from "../../models/Event";

function EditZooEventPage() {
  const apiJson = useApiJson();

  const { zooEventId } = useParams<{ zooEventId: string }>();
  const [curZooEvent, setCurZooEvent] =
    useState<ZooEvent | null>(null);
  const [refreshSeed, setRefreshSeed] = useState<number>(0);

  useEffect(() => {
    const fetchZooEvent = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/zooEvent/getZooEventById/${zooEventId}`
        );
        setCurZooEvent(responseJson["zooEvent"] as ZooEvent);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchZooEvent();
  }, [refreshSeed]);

  return (
    <div className="p-10">
      {curZooEvent && curZooEvent.zooEventId != -1 && (
        <EditEventForm
          curZooEvent={curZooEvent}
          refreshSeed={refreshSeed}
          setRefreshSeed={setRefreshSeed}
        />
      )}
    </div>
  );
}

export default EditZooEventPage;
