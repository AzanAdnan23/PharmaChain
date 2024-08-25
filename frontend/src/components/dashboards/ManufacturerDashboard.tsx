"use client";

// src/app/dashboard/manufacturer/page.tsx
import CreateBatchForm from "../manufacturer/CreateBatch";
import CreatedBatchesTable from "../manufacturer/CreatedBatches";
import CurrentOrdersTable from "../manufacturer/CurrentOrders";
import OrdersFulfilledTable from "../manufacturer/OrdersFulfilled";
import OutgoingRFID from "../manufacturer/OutgoingRFID";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LChart } from "@/components/charts/LChart"


const ManufacturerDashboard = (props: any) => {
  return (
    <main className="p-4 grid grid-cols-4 gap-4 flex-grow">
      <div className="col-span-1 flex flex-col gap-4">
        <div className="">
          <CreateBatchForm tempRFID={props.tempRFID} />
        </div>
        <LChart chartTitle="Popular Orders" chartDescription="" />
        <OutgoingRFID tempRFID={props.tempRFID} />
      </div>
      <div className="col-span-3">
        <Tabs defaultValue="createdbatches" className="h-full flex flex-col">
          <TabsList className="w-fit">
            <TabsTrigger value="createdbatches">Created Batches</TabsTrigger>
            <TabsTrigger value="currentorders">Current Orders</TabsTrigger>
            <TabsTrigger value="ordersfulfilled">Orders Fulfilled</TabsTrigger>
          </TabsList>
          <TabsContent value="createdbatches" className="flex-grow">
            <CreatedBatchesTable />
          </TabsContent>
          <TabsContent value="currentorders" className="flex-grow">
            <CurrentOrdersTable />
          </TabsContent>
          <TabsContent value="ordersfulfilled" className="flex-grow">
            <OrdersFulfilledTable />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default ManufacturerDashboard;