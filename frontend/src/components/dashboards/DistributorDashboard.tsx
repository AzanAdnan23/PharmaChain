"use client";

// src/app/dashboard/distributor/page.tsx
import OrderBatchForm from "../distributor/OrderBatchForm";
import CurrentOrderBatches from "../distributor/CurrentOrderBatches";
import FulfilledDistributorsOrdersTable from "../distributor/FullfiledDistributorsOrders";
import ProviderOrdersTable from "../distributor/ProviderOrdersTable";
import StockTable from "../distributor/StockTable";
// import FulfilledProviderOrdersTable from "../provider/FulfilledProviderOrdersTable";
import { DistributorRFID } from "../distributor/DistributorRFID";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LChart } from "@/components/charts/LChart";

const DistributorDashboard = (props: any) => {
  return (
    <main className="grid flex-grow grid-cols-4 gap-4 p-4">
      <div className="col-span-1 flex flex-col gap-4">
        <div className="">
          <OrderBatchForm />
        </div>
        <LChart chartTitle="Orders" chartDescription="" />
        <div className="">
          <DistributorRFID tempRFID={props.tempRFID} />
        </div>
      </div>
      <div className="col-span-3">
        <Tabs defaultValue="currentorders" className="flex h-full flex-col">
          <TabsList className="w-fit">
            <TabsTrigger value="currentorders">Current Orders</TabsTrigger>
            <TabsTrigger value="fulfilledorders">Fulfilled Orders</TabsTrigger>
            <TabsTrigger value="providerorders">Provider Orders</TabsTrigger>
            <TabsTrigger value="stock">Stock</TabsTrigger>
            {/* <TabsTrigger value="fulfilledproviderorders">Fulfilled Provider Orders</TabsTrigger> */}
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
          {/* <TabsContent value="fulfilledproviderorders" className="flex-grow">
            <FulfilledProviderOrdersTable />
          </TabsContent> */}
        </Tabs>
      </div>
    </main>
  );
};

export default DistributorDashboard;
