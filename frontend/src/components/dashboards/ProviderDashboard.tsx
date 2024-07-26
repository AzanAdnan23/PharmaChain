// src/app/dashboard/provider/page.tsx
import OrderMedsForm from '../provider/OrderMedsForm';
import OrderDetailsTable from '../provider/OrderDetailsTable';
import StockTable from '../distributor/StockTable';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const ProviderDashboard = () => {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-10">
      <OrderMedsForm />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderDetailsTable />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <StockTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProviderDashboard;
