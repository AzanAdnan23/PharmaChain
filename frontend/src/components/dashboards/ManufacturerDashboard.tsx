"use client";

// src/app/dashboard/manufacturer/page.tsx
import CreateBatchForm from "../manufacturer/CreateBatch";
import CreatedBatchesTable from "../manufacturer/CreatedBatches";
import CurrentOrdersTable from "../manufacturer/CurrentOrders";
import OrdersFulfilledTable from "../manufacturer/OrdersFulfilled";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const ManufacturerDashboard = () => {
  return (
    <main className="p-4 grid grid-cols-4 grid-rows-2 gap-4 flex-grow">
      <div className="col-span-1]">
        <CreateBatchForm />
      </div>
      <div className="col-span-3 h-[50vh]">
          <CreatedBatchesTable />
      </div>
      <div className="col-span-2">
        <CurrentOrdersTable />
      </div>
      <div className="col-span-2">
        <OrdersFulfilledTable />
      </div>
    </main>
  );
};

export default ManufacturerDashboard;