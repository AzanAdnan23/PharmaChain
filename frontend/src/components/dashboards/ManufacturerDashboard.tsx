// src/app/dashboard/manufacturer/page.tsx
import CreateBatchForm from "../manufacturer/CreateBatch";
import CreatedBatchesTable from "../manufacturer/CreatedBatches";
import CurrentOrdersTable from "../manufacturer/CurrentOrders";
import OrdersFulfilledTable from "../manufacturer/OrdersFulfilled";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ManufacturerDashboard = () => {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-10">
      <CreateBatchForm />

      <CreatedBatchesTable />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <OrdersFulfilledTable />
        <CurrentOrdersTable />
      </div>
    </div>
  );
};

export default ManufacturerDashboard;
