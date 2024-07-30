// src/app/dashboard/distributor/page.tsx
import { useState } from "react";
import OrderBatchForm from "../distributor/OrderBatchForm";
import BatchDetailsTable from "../distributor/OrderedBatches";
import ProviderOrdersTable from "../distributor/ProviderOrdersTable";
import StockTable from "../distributor/StockTable";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const DistributorDashboard = () => {
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
    <div className="flex flex-col gap-8 p-4 md:p-10">
      <OrderBatchForm />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <BatchDetailsTable />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Provider Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <ProviderOrdersTable />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <StockTable />
          </CardContent>
        </Card>

        <Card>
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
              <Button
                onClick={handleOutgoingRFID}
                variant="secondary"
                className="w-full"
              >
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
      </div>
    </div>
  );
};

export default DistributorDashboard;
