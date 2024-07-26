// src/components/OrderBatchForm.tsx
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useForm } from 'react-hook-form';

interface FormData {
  medicineName: string;
  orderQuantity: number;
}

const OrderBatchForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (data: FormData) => {
    // Handle form submission logic
    console.log(data);
    setSubmitted(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Batch</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Medicine Name</label>
            <Input
              {...register('medicineName', { required: 'Medicine name is required' })}
              placeholder="Enter medicine name"
              className="mt-1"
            />
            {errors.medicineName && <p className="text-red-500 text-sm">{errors.medicineName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Order Quantity</label>
            <Input
              type="number"
              {...register('orderQuantity', { required: 'Order quantity is required' })}
              placeholder="Enter order quantity"
              className="mt-1"
            />
            {errors.orderQuantity && <p className="text-red-500 text-sm">{errors.orderQuantity.message}</p>}
          </div>
          {/* <Button type="submit" variant="primary" className="w-full">Place Order</Button> */}
          <Button type="submit" className="w-full">Place Order</Button>
          {submitted && <p className="text-green-500 mt-2">Order placed successfully!</p>}
        </form>
      </CardContent>
    </Card>
  );
};

export default OrderBatchForm;
