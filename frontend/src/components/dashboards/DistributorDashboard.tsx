"use client";

// src/app/dashboard/distributor/page.tsx
import { useState } from "react";
import OrderBatchForm from "../distributor/OrderBatchForm";
import BatchDetailsTable from "../distributor/OrderedBatches";
import FulfilledDistributorsOrdersTable from "../distributor/FullfiledDistributorsOrders";
import ProviderOrdersTable from "../distributor/ProviderOrdersTable";
import StockTable from "../distributor/StockTable";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

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
    <main className="bg-muted/40 min-h-screen">
      <Navbar></Navbar>
    <div className="flex flex-col gap-8 p-4">
      <OrderBatchForm />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <BatchDetailsTable />
        <StockTable />
      </div>
      <FulfilledDistributorsOrdersTable />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <ProviderOrdersTable />
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
    </main>
  );
};

export default DistributorDashboard;
