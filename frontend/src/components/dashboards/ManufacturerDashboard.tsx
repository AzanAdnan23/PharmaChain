// src/app/dashboard/manufacturer/page.tsx
import CreateBatchForm from "../manufacturer/CreateBatch";
import CreatedBatchesTable from "../manufacturer/CreatedBatches";
import CurrentOrdersTable from "../manufacturer/CurrentOrders";
import OrdersFulfilledTable from "../manufacturer/OrdersFulfilled";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ManufacturerDashboard = () => {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-10">
      <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-3">
        <div className="md:col-span-1">
          <CreateBatchForm />
        </div>
        <div className="md:col-span-2">
          <CreatedBatchesTable />
        </div>
      </div>
      <CurrentOrdersTable />
      <OrdersFulfilledTable />
    </div>
  );
};

export default ManufacturerDashboard;