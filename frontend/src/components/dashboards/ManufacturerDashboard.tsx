// src/app/dashboard/manufacturer/page.tsx
import CreateBatchForm from '../manufacturer/CreateBatch';
import CreatedBatchesTable from '../manufacturer/CreatedBatches';
import CurrentOrdersTable from '../manufacturer/CurrentOrders';
import OrdersFulfilledTable from '../manufacturer/OrdersFulfilled';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const ManufacturerDashboard = () => {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-10">
      <CreateBatchForm />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Created Batches</CardTitle>
          </CardHeader>
          <CardContent>
            <CreatedBatchesTable />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Current Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <CurrentOrdersTable />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Orders Fulfilled</CardTitle>
        </CardHeader>
        <CardContent>
          <OrdersFulfilledTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default ManufacturerDashboard;
