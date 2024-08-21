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
import { ScrollArea } from "@/components/ui/scroll-area";

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
  quantity: bigint; // Changed to bigint
  isAssigned: boolean;
  status: number; // Use number for status to match the API output
}

interface Order extends ProviderOrder { } // For consistency

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

  const getStatusString = (status: number): string => {
    switch (status) {
      case 0:
        return OrderStatus.Pending;
      case 1:
        return OrderStatus.InTransit;
      case 2:
        return OrderStatus.Approved;
      case 3:
        return OrderStatus.Reached;
      case 4:
        return OrderStatus.Recalled;
      default:
        return "Unknown";
    }
  };

  const handleAssign = () => {
    if (selectedOrder) {
      // Handle assign action
      console.log("Assigning Order", selectedOrder);
    }
  };

  return (
    <Card className="h-full">
      <ScrollArea className="h-full w-full">
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">
                    No orders from provider.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow
                    key={order.orderId}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <TableCell>{order.orderId.toString()}</TableCell>
                    <TableCell>{order.medName}</TableCell>
                    <TableCell>{order.quantity.toString()}</TableCell> 
                    <TableCell>{getStatusString(order.status)}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleAssign()}>
                        Assign to Provider
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {selectedOrder && (
            <AssignToProviderForm
              order={selectedOrder}
              onClose={() => setSelectedOrder(null)}
            />
          )}
        </CardContent>
      </ScrollArea>
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
