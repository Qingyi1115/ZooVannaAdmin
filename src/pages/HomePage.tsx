import React from "react";
import Sidebar from "../components/Deprecated/Sidebar";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function HomePage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="h-screen w-full p-10">
      <div className="flex h-5/6 w-full gap-10">
        <div className="flex flex-col gap-10">
          <Card className="h-1/2 w-full flex-grow p-10">
            <Skeleton className="h-[20px] w-[100px] rounded-full" />
          </Card>
          <div className="flex gap-10">
            <Card className="h-full w-full p-10">
              <Skeleton className="h-[20px] w-[100px] rounded-full" />
            </Card>
            <Card className="h-full w-full p-10">
              <Skeleton className="h-[20px] w-[100px] rounded-full" />
            </Card>
          </div>
        </div>
        <Card className="h-full w-1/2 p-10">
          <Skeleton className="mb-4 h-[20px] w-2/3 rounded-full" />
          <Skeleton className="mb-4 h-[20px] w-2/3 rounded-full" />
          <Skeleton className="mb-4 h-[20px] w-2/3 rounded-full" />
        </Card>
      </div>
    </div>
  );
}

export default HomePage;
