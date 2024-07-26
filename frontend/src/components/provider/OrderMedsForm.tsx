import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function OrderMedsForm() {
  const [medicineName, setMedicineName] = useState("");
  const [quantity, setQuantity] = useState(0);

  const handleSubmit = () => {
    // Handle form submission
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Medicines</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            type="text" 
            placeholder="Medicine Name" 
            value={medicineName} 
            onChange={(e) => setMedicineName(e.target.value)} 
            className="mb-2" 
          />
          <Input 
            type="number" 
            placeholder="Quantity" 
            value={quantity} 
            onChange={(e) => setQuantity(Number(e.target.value))} 
          />
          <Button type="submit" className="mt-4">Order</Button>
        </form>
      </CardContent>
    </Card>
  );
}
