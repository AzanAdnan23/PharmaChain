import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const DistributorRFID = () => {
    const [incomingRFID, setIncomingRFID] = useState("");
    const [outgoingRFID, setOutgoingRFID] = useState("");

    const handleIncomingRFID = () => {
        // Handle incoming RFID logic
        console.log("Incoming RFID:", incomingRFID);
    };

    const handleOutgoingRFID = () => {
        // Handle outgoing RFID logic
        console.log("Outgoing RFID:", outgoingRFID);
    };

    return (
        <Card className="h-full w-full">
            <CardHeader>
                <CardTitle>RFID Scanning</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* <Button onClick={handleIncomingRFID} variant="primary" className="w-full">
                Scan Incoming RFID
              </Button> */}
                    <Button onClick={handleIncomingRFID} className="w-full">
                        Scan Incoming RFID
                    </Button>
                    <Button onClick={handleOutgoingRFID} variant="secondary" className="w-full">
                        Scan Outgoing RFID
                    </Button>
                    <div className="mt-2 space-y-2">
                        <div className="text-gray-600">
                            Incoming RFID: {incomingRFID}
                        </div>
                        <div className="text-gray-600">
                            Outgoing RFID: {outgoingRFID}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}