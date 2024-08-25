"use client";

import OrderMedsForm from "../provider/OrderMedsForm";
import OrderDetailsTable from "../provider/OrderDetailsTable";
import StockTable from "../provider/StockTable";
import FulfilledProviderOrdersTable from "../provider/FulfilledProviderOrdersTable";
import IncomingRFIDButton from "../provider/IncomingRFIDButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { LChart } from "../charts/LChart";

const ProviderDashboard = (props: any) => {
  return (
    <main className="p-4 grid grid-cols-4 gap-4 flex-grow">
      <div className="col-span-1 flex flex-col gap-4">
      <OrderMedsForm />
      <LChart chartTitle="Amount of Orders" chartDescription="" />
      <IncomingRFIDButton tempRFID={props.tempRFID} />
      </div>
      <div className="col-span-3">
        <Tabs defaultValue="orderdetails" className="h-full flex flex-col">
          <TabsList className="w-fit">
            <TabsTrigger value="orderdetails">Order Details</TabsTrigger>
            <TabsTrigger value="stock">Stock</TabsTrigger>
            <TabsTrigger value="ordersfulfilled">Fulfilled Provider Orders</TabsTrigger>
          </TabsList>
          <TabsContent value="orderdetails" className="flex-grow">
          <OrderDetailsTable />
          </TabsContent>
          <TabsContent value="stock" className="flex-grow">
          <StockTable />
          </TabsContent>
          <TabsContent value="ordersfulfilled" className="flex-grow">
          <FulfilledProviderOrdersTable />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default ProviderDashboard;
