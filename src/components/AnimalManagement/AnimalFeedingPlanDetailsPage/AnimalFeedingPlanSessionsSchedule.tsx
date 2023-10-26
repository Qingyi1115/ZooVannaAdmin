import React, { useState, useEffect } from "react";
import useApiJson from "../../../hooks/useApiJson";
import FeedingPlan from "../../../models/FeedingPlan";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FeedingPlanSessionDetail from "../../../models/FeedingPlanSessionDetail";
import FeedingItem from "../../../models/FeedingItem";
import Animal from "../../../models/Animal";

interface AnimalFeedingPlanSessionsScheduleProps {
  curFeedingPlan: FeedingPlan;
  setCurFeedingPlan: any;
}

function AnimalFeedingPlanSessionsSchedule(
  props: AnimalFeedingPlanSessionsScheduleProps
) {
  const { curFeedingPlan, setCurFeedingPlan } = props;
  const [feedingPlanSessions, setFeedingPlanSessions] = useState<
    FeedingPlanSessionDetail[]
  >(
    curFeedingPlan.feedingPlanSessionDetails
      ? [...curFeedingPlan.feedingPlanSessionDetails]
      : []
  );

  // templates
  function groupFeedingItemsByAnimal(
    feedingPlanSession: FeedingPlanSessionDetail
  ) {
    const result: {
      [key: string]: { animal: Animal; feedingItems: FeedingItem[] };
    } = {};

    if (feedingPlanSession.feedingItems) {
      feedingPlanSession.feedingItems.forEach((item) => {
        const animalId = item.animal?.animalId;
        if (animalId !== undefined && item.animal != undefined) {
          if (!result[animalId]) {
            result[animalId] = { animal: item.animal, feedingItems: [] };
          }
          result[animalId].feedingItems.push(item);
        }
      });
    }

    return result;
  }

  const sessionTemplate = (
    curDayOfTheWeek: string,
    curEventTimingType: string
  ) => {
    return (
      <React.Fragment>
        <div>
          {feedingPlanSessions
            .filter(
              (session) =>
                session.dayOfWeek === curDayOfTheWeek &&
                session.eventTimingType === curEventTimingType
            )
            .map((session) => (
              // session.feedingItems?.map((item, index) => (
              //   <div key={`MONDAYMorningItem-${index}`}>
              //     {item.foodCategory}
              //   </div>
              // ))
              <div>
                {Object.values(groupFeedingItemsByAnimal(session)).map(
                  (
                    group: {
                      animal: Animal;
                      feedingItems: FeedingItem[];
                    },
                    index
                  ) => (
                    <div key={`animal-${group.animal.animalId}`}>
                      <div className="font-medium">
                        {group.animal.houseName}:
                      </div>
                      <ul>
                        {group.feedingItems.map((item, itemIndex) => (
                          <li
                            key={`feeding-item-${item.animal?.animalId}-${itemIndex}`}
                          >
                            • {item.foodCategory}:{" "}
                            {item.amount != 0 ? (
                              <span>
                                {item.amount} {item.unit}
                              </span>
                            ) : (
                              <span>None!</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
            ))}
        </div>
      </React.Fragment>
    );
  };

  const sessionCell = (curDayOfTheWeek: string, curEventTimingType: string) => {
    const sessionExists = !!feedingPlanSessions.find(
      (session) =>
        session.dayOfWeek === curDayOfTheWeek &&
        session.eventTimingType === curEventTimingType
    );

    return (
      <TableCell className="min-h-[8rem] w-1/3 align-top font-medium hover:bg-muted/50">
        <div className="flex justify-between">
          <div className="font-bold">
            {curEventTimingType.charAt(0).toUpperCase() +
              curEventTimingType.slice(1).toLowerCase()}
          </div>
          {/* <div>
            {isSessionExist(curDayOfTheWeek, curEventTimingType) &&
              editSessionDialog(curDayOfTheWeek, curEventTimingType)}
          </div> */}
        </div>
        {sessionExists ? (
          <div>{sessionTemplate(curDayOfTheWeek, curEventTimingType)}</div>
        ) : (
          <div className="text-orange-800">No session created!</div>
        )}
      </TableCell>
    );
  };

  return (
    <div>
      <Table>
        <TableBody>
          <TableRow className="bg-muted/20">
            <TableCell className="font-medium" colSpan={3}>
              MONDAY
            </TableCell>
          </TableRow>
          <TableRow
            key={"MONDAYSessions"}
            className="bg-muted/20 hover:bg-muted/20"
          >
            {sessionCell("MONDAY", "MORNING")}
            {sessionCell("MONDAY", "AFTERNOON")}
            {sessionCell("MONDAY", "EVENING")}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium" colSpan={3}>
              TUESDAY
            </TableCell>
          </TableRow>
          <TableRow key={"TUESDAYSessions"} className="hover:bg-transparent">
            {sessionCell("TUESDAY", "MORNING")}
            {sessionCell("TUESDAY", "AFTERNOON")}
            {sessionCell("TUESDAY", "EVENING")}
          </TableRow>
          <TableRow className="bg-muted/20">
            <TableCell className="font-medium" colSpan={3}>
              WEDNESDAY
            </TableCell>
          </TableRow>
          <TableRow
            key={"WEDNESDAYSessions"}
            className="bg-muted/20 hover:bg-muted/20"
          >
            {sessionCell("WEDNESDAY", "MORNING")}
            {sessionCell("WEDNESDAY", "AFTERNOON")}
            {sessionCell("WEDNESDAY", "EVENING")}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium" colSpan={3}>
              THURSDAY
            </TableCell>
          </TableRow>
          <TableRow key={"THURSDAYSessions"} className="hover:bg-transparent">
            {sessionCell("THURSDAY", "MORNING")}
            {sessionCell("THURSDAY", "AFTERNOON")}
            {sessionCell("THURSDAY", "EVENING")}
          </TableRow>
          <TableRow className="bg-muted/20">
            <TableCell className="font-medium" colSpan={3}>
              FRIDAY
            </TableCell>
          </TableRow>
          <TableRow
            key={"FRIDAYSessions"}
            className="bg-muted/20 hover:bg-muted/20"
          >
            {sessionCell("FRIDAY", "MORNING")}
            {sessionCell("FRIDAY", "AFTERNOON")}
            {sessionCell("FRIDAY", "EVENING")}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium" colSpan={3}>
              SATURDAY
            </TableCell>
          </TableRow>
          <TableRow key={"SATURDAYSessions"} className="hover:bg-transparent">
            {sessionCell("SATURDAY", "MORNING")}
            {sessionCell("SATURDAY", "AFTERNOON")}
            {sessionCell("SATURDAY", "EVENING")}
          </TableRow>
          <TableRow className="bg-muted/20">
            <TableCell className="font-medium" colSpan={3}>
              SUNDAY
            </TableCell>
          </TableRow>
          <TableRow
            key={"SUNDAYSessions"}
            className="bg-muted/20 hover:bg-muted/20"
          >
            {sessionCell("SUNDAY", "MORNING")}
            {sessionCell("SUNDAY", "AFTERNOON")}
            {sessionCell("SUNDAY", "EVENING")}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default AnimalFeedingPlanSessionsSchedule;
