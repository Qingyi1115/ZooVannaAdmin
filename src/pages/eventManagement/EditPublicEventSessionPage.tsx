import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useApiJson from "../../hooks/useApiJson";
import PublicEventSession from "../../models/Event";
import EditPublicEventSessionForm from "./EditPublicEventSessionForm";

function EditPublicEventSessionPage() {
  const apiJson = useApiJson();

  const { publicEventSessionId } = useParams<{ publicEventSessionId: string }>();
  const [curPublicEventSession, setCurPublicEventSession] =
    useState<PublicEventSession | null>(null);
  const [refreshSeed, setRefreshSeed] = useState<number>(0);

  useEffect(() => {
    const fetchPublicEventSession = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/zooEvent/getPublicEventSessionById/${publicEventSessionId}`
        );
        setCurPublicEventSession(responseJson["publicEventSession"] as PublicEventSession);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchPublicEventSession();
  }, [refreshSeed]);

  return (
    <div className="p-10">
      {curPublicEventSession && curPublicEventSession.zooEventId != -1 && (
        <EditPublicEventSessionForm
          curPublicEventSession={curPublicEventSession}
          refreshSeed={refreshSeed}
          setRefreshSeed={setRefreshSeed}
        />
      )}
    </div>
  );
}

export default EditPublicEventSessionPage;
