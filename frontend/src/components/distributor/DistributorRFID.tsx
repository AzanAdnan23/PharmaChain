import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import IncomingRFIDButton from "./IncomingRFIDButton";
import OutgoingRFIDButton from "./OutgoingRFIDButton";

export const DistributorRFID = () => {
  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle>RFID Scanning</CardTitle>
      </CardHeader>
      <CardContent>
        <IncomingRFIDButton />
        <OutgoingRFIDButton />
      </CardContent>
    </Card>
  );
};
