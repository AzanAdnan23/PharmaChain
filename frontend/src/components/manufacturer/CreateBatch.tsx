import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function CreateBatchForm() {
  const [rfidUID, setRfidUID] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [medicineName, setMedicineName] = useState("");

  const handleSubmit = () => {
    // Handle form submission
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Batch</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            type="text" 
            value={`Auto-generated Batch ID`} 
            readOnly 
            className="mb-2" 
          />
          <Input 
            type="text" 
            placeholder="RFID UID" 
            value={rfidUID} 
            onChange={(e) => setRfidUID(e.target.value)} 
            className="mb-2" 
          />
          <Input 
            type="number" 
            placeholder="Quantity" 
            value={quantity} 
            onChange={(e) => setQuantity(Number(e.target.value))} 
            className="mb-2" 
          />
          <Input 
            type="text" 
            placeholder="Medicine Name" 
            value={medicineName} 
            onChange={(e) => setMedicineName(e.target.value)} 
          />
          <Button type="submit" className="mt-4">Create Batch</Button>
        </form>
      </CardContent>
    </Card>
  );
}
