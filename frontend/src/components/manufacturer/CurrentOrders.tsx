import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "@/components/ui/input";

interface Order {
  orderID: string;
  medicineName: string;
  quantity: number;
  status: string;
}

export default function CurrentOrdersTable() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const orders: Order[] = [
    { orderID: "O001", medicineName: "Paracetamol", quantity: 50, status: "Pending" },
    // ... other orders
  ];

  const handleAssign = () => {
    // Handle assign action
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Medicine Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.orderID} onClick={() => setSelectedOrder(order)}>
                <TableCell>{order.orderID}</TableCell>
                <TableCell>{order.medicineName}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>
                  <Button onClick={() => handleAssign()}>Assign to Distributor</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {selectedOrder && (
          <AssignToDistributorForm 
            order={selectedOrder} 
            onClose={() => setSelectedOrder(null)} 
          />
        )}
      </CardContent>
    </Card>
  );
}

function AssignToDistributorForm({ order, onClose }: { order: Order, onClose: () => void }) {
  const [batchID, setBatchID] = useState("");
  const [distributorAddress, setDistributorAddress] = useState("");

  const handleSubmit = () => {
    // Handle form submission
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assign Order</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            type="text" 
            placeholder="Batch ID" 
            value={batchID} 
            onChange={(e) => setBatchID(e.target.value)} 
            className="mb-2" 
          />
          <Input 
            type="text" 
            placeholder="Distributor Address" 
            value={distributorAddress} 
            onChange={(e) => setDistributorAddress(e.target.value)} 
          />
          <Button type="submit" className="mt-4">Assign</Button>
          <Button type="button" onClick={onClose} className="ml-2">Cancel</Button>
        </form>
      </CardContent>
    </Card>
  );
}
