import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import { useNavigate, useParams } from "react-router-dom";
import AllPublicEventsDatatable from "../../components/EventManagement/AllPublicEventsDatatable";
import useApiJson from "../../hooks/useApiJson";
import FeedingPlan from "../../models/FeedingPlan";
import PublicEvent from "../../models/PublicEvent";

function ViewAllPublicEventPage() {
  const apiJson = useApiJson();
  const navigate = useNavigate();

  const { speciesCode } = useParams<{ speciesCode: string }>();
  const [allPublicEvent, setAllPublicEvent] = useState<PublicEvent[]>([]);

  useEffect(() => {
    apiJson.get(
      `http://localhost:3000/api/zooEvent/getAllPublicEvents`
    ).then(res => {
      console.log("ViewAllPublicEventPage", res.publicEvents)
      setAllPublicEvent(res.publicEvents);
    })
      .catch(err => console.log(err));

  }, []);

  // feeding plans datatable
  const [feedingPlansList, setFeedingPlansList] = useState<FeedingPlan[]>([]);
  // useEffect(() => {
  //     apiJson.get(
  //         `http://localhost:3000/api/animal/getFeedingPlansBySpeciesCode/${speciesCode}`
  //     );
  //     setFeedingPlansList(responseJson as FeedingPlan[]);
  // }, []);

  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-lg">
        {/* Header */}
        <div className="flex flex-col">
          <div className="mb-4 flex justify-between">
            {/* <NavLink className="flex" to={(-1)}> */}
            <Button
              onClick={() => navigate(-1)}
              variant={"outline"}
              type="button"
              className=""
            >
              Back
            </Button>
            {/* </NavLink> */}
            <span className="self-center text-title-xl font-bold">
              Public Events
            </span>
            <Button disabled className="invisible">
              Back
            </Button>
          </div>
        </div>

        {/*  */}
        {/* <Button
          onClick={() => navigate(`/animal/createfeedingplan/${speciesCode}`)}
          className=""
        >
          Create New Feeding Plan
        </Button> */}
        <div>
          <AllPublicEventsDatatable
            allPublicEvent={allPublicEvent}
          />
        </div>
      </div>
    </div>
  );
}

export default ViewAllPublicEventPage;
