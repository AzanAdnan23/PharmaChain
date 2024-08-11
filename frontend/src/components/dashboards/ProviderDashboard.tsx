"use client";

import OrderMedsForm from "../provider/OrderMedsForm";
import OrderDetailsTable from "../provider/OrderDetailsTable";
import StockTable from "../distributor/StockTable";
import FulfilledProviderOrdersTable from "../provider/FulfilledProviderOrdersTable";
import IncomingRFIDButton from "../provider/IncomingRFIDButton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ProviderDashboard = () => {
  return (
    <main className="flex min-h-screen flex-col gap-8 bg-muted/40 p-4 md:p-10">
      <OrderMedsForm />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <OrderDetailsTable />
        <StockTable />
      </div>
      <IncomingRFIDButton />
      <FulfilledProviderOrdersTable />
    </main>
  );
};

export default ProviderDashboard;
