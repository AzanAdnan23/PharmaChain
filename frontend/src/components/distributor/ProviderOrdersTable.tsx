import { useEffect, useState } from "react";
import { getContract } from "viem";
import { useAccount } from "@alchemy/aa-alchemy/react";
import {
  accountType,
  ContractAddress,
  ContractAbi,
  publicClient,
} from "@/config";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input"; // Ensure Input is correctly imported

enum OrderStatus {
  Pending = "Pending",
  InTransit = "In Transit",
  Approved = "Approved",
  Reached = "Reached",
  Recalled = "Recalled",
}

interface ProviderOrder {
  orderId: number;
  distributor: string;
  provider: string;
  orderDate: number;
  batchId: number;
  medName: string;
  quantity: number;
  isAssigned: boolean;
  status: OrderStatus;
}

interface Order extends ProviderOrder {} // For consistency

export default function ProviderOrdersTable() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [orders, setOrders] = useState<ProviderOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { address } = useAccount({ type: accountType });

  const fetchOrderedBatches = async () => {
    if (!address) return;

    const PharmaChain = getContract({
      address: ContractAddress,
      abi: ContractAbi,
      client: publicClient,
    });

    setIsLoading(true);
    try {
      const result: any = await PharmaChain.read.getPendingProviderOrders();
      console.log("Fetching Provider Orders", result);
      setOrders(result); // Assuming result is an array of ProviderOrder
    } catch (error) {
      console.error("Error while fetching orders", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderedBatches();
  }, [address]);

  const handleAssign = () => {
    if (selectedOrder) {
      // Handle assign action
      console.log("Assigning Order", selectedOrder);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Provider Orders</CardTitle>
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
              <TableRow
                key={order.orderId}
                onClick={() => setSelectedOrder(order)}
              >
                <TableCell>{order.orderId}</TableCell>
                <TableCell>{order.medName}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>
                  <Button onClick={() => handleAssign()}>
                    Assign to Provider
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {selectedOrder && (
          <AssignToProviderForm
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </CardContent>
    </Card>
  );
}

interface AssignToProviderFormProps {
  order: Order;
  onClose: () => void;
}

function AssignToProviderForm({ order, onClose }: AssignToProviderFormProps) {
  const [medicineUnits, setMedicineUnits] = useState<number>(0);
  const [providerAddress, setProviderAddress] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission
    console.log({ medicineUnits, providerAddress });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assign Order</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Medicine Units
            </label>
            <Input
              type="number"
              placeholder="Medicine Units"
              value={medicineUnits}
              onChange={(e) => setMedicineUnits(Number(e.target.value))}
              className="mb-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Provider Address
            </label>
            <Input
              type="text"
              placeholder="Provider Address"
              value={providerAddress}
              onChange={(e) => setProviderAddress(e.target.value)}
            />
          </div>
          <Button type="submit" className="mt-4">
            Assign
          </Button>
          <Button type="button" onClick={onClose} className="ml-2">
            Cancel
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
