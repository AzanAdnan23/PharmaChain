"use client";

import OrderMedsForm from '../provider/OrderMedsForm';
import OrderDetailsTable from '../provider/OrderDetailsTable';
import StockTable from '../distributor/StockTable';
import FulfilledProviderOrdersTable from '../provider/FulfilledProviderOrdersTable';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const ProviderDashboard = () => {
  return (
    <main className="flex flex-col gap-8 p-4 md:p-10 bg-muted/40 min-h-screen">
      <OrderMedsForm />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <OrderDetailsTable />
        <StockTable />
      </div>
      
      <FulfilledProviderOrdersTable />
    </main>
  );
};

export default ProviderDashboard;
