"use client";

// src/app/dashboard/manufacturer/page.tsx
import CreateBatchForm from "../manufacturer/CreateBatch";
import CreatedBatchesTable from "../manufacturer/CreatedBatches";
import CurrentOrdersTable from "../manufacturer/CurrentOrders";
import OrdersFulfilledTable from "../manufacturer/OrdersFulfilled";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";


const ManufacturerDashboard = () => {
  return (
    <main className="bg-muted/40 min-h-screen">
      <Navbar></Navbar>
      <div className="p-4 grid grid-cols-2 gap-4">
      <CreateBatchForm />
      <CreatedBatchesTable />
      <CurrentOrdersTable />
      <OrdersFulfilledTable />
      </div>
    </main>
  );
};

export default ManufacturerDashboard;