import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function FulfilledDistributorsOrdersTable() {
  const fulfilledOrders = [
    {
      orderID: "F001",
      medicineName: "Ibuprofen",
      quantity: 50,
      date: "2024-07-01",
    },
    {
      orderID: "F002",
      medicineName: "Paracetamol",
      quantity: 100,
      date: "2024-07-02",
    },
    // ... other fulfilled orders
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fulfilled Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Medicine Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fulfilledOrders.map(
              ({ orderID, medicineName, quantity, date }) => (
                <TableRow key={orderID}>
                  <TableCell>{orderID}</TableCell>
                  <TableCell>{medicineName}</TableCell>
                  <TableCell>{quantity}</TableCell>
                  <TableCell>{date}</TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
