import OrderMedsForm from '../provider/OrderMedsForm';
import OrderDetailsTable from '../provider/OrderDetailsTable';
import StockTable from '../distributor/StockTable';
import FulfilledProviderOrdersTable from '../provider/FulfilledProviderOrdersTable';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const ProviderDashboard = () => {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-10">
      <OrderMedsForm />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <OrderDetailsTable />
        <StockTable />
      </div>
      
      <FulfilledProviderOrdersTable />
    </div>
  );
};

export default ProviderDashboard;
