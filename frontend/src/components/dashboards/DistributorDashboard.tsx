"use client";

// src/app/dashboard/distributor/page.tsx
import OrderBatchForm from "../distributor/OrderBatchForm";
import CurrentOrderBatches from "../distributor/CurrentOrderBatches";
import FulfilledDistributorsOrdersTable from "../distributor/FullfiledDistributorsOrders";
import ProviderOrdersTable from "../distributor/ProviderOrdersTable";
import StockTable from "../distributor/StockTable";
import { DistributorRFID } from "../distributor/DistributorRFID";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PChart } from "@/components/charts/PChart"

const DistributorDashboard = () => {
  return (
    <main className="p-4 grid grid-cols-4 gap-4 flex-grow">
      <div className="col-span-1 flex flex-col gap-4">
        <div className="">
          <OrderBatchForm />
        </div>
        <div className="">
          <DistributorRFID />
        </div>
        <PChart chartTitle="Orders" chartDescription="" />
      </div>
      <div className="col-span-3">
        <Tabs defaultValue="currentorders" className="h-full flex flex-col">
          <TabsList className="w-fit">
            <TabsTrigger value="currentorders">Current Orders</TabsTrigger>
            <TabsTrigger value="fulfilledorders">Fulfilled Orders</TabsTrigger>
            <TabsTrigger value="providerorders">Provider Orders</TabsTrigger>
            <TabsTrigger value="stock">Stock</TabsTrigger>
          </TabsList>
          <TabsContent value="fulfilledorders" className="flex-grow">
            <FulfilledDistributorsOrdersTable />
          </TabsContent>
          <TabsContent value="currentorders" className="flex-grow">
            <CurrentOrderBatches />
          </TabsContent>
          <TabsContent value="providerorders" className="flex-grow">
            <ProviderOrdersTable />
          </TabsContent>
          <TabsContent value="stock" className="flex-grow">
            <StockTable />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default DistributorDashboard;
