import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import IncomingRFIDButton from "./IncomingRFIDButton";
import OutgoingRFIDButton from "./OutgoingRFIDButton";

export const DistributorRFID = (props: any) => {
  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle>RFID Scanning</CardTitle>
      </CardHeader>
      <CardContent>
        <IncomingRFIDButton tempRFID={props.tempRFID} />
        <OutgoingRFIDButton tempRFID={props.tempRFID} />
      </CardContent>
    </Card>
  );
};
