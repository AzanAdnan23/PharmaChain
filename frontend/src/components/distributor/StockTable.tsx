import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function StockTable() {
  const stock = [
    { medicineName: "Amoxicillin", quantity: 120 },
    // ... other stock items
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medicine Name</TableHead>
              <TableHead>Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stock.map((item) => (
              <TableRow key={item.medicineName}>
                <TableCell>{item.medicineName}</TableCell>
                <TableCell>{item.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
