import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function OrderBatchDetailsTable() {
  const batches = [
    {
      batchID: "001",
      medicineName: "Paracetamol",
      orderStatus: "Ordered",
      quantity: 50,
    },
    // ... other batches
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Batch Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Batch ID</TableHead>
              <TableHead>Medicine Name</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batches.map((batch) => (
              <TableRow key={batch.batchID}>
                <TableCell>{batch.batchID}</TableCell>
                <TableCell>{batch.medicineName}</TableCell>
                <TableCell>{batch.orderStatus}</TableCell>
                <TableCell>{batch.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
