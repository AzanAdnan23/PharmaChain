import { useEffect, useState } from "react";
import { getContract, encodeFunctionData } from "viem";
import {
  useAccount,
  useSendUserOperation,
  useSmartAccountClient,
} from "@alchemy/aa-alchemy/react";
import {
  accountType,
  gasManagerConfig,
  accountClientOptions as opts,
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
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"; // Import Dialog components
import { Badge } from "@/components/ui/badge";
import { Toaster, toast } from "sonner";

enum OrderStatus {
  Pending = "Pending",
  InTransit = "In Transit",
  Approved = "Approved",
  Reached = "Reached",
  Recalled = "Recalled",
}

interface ProviderOrder {
  orderId: number;
  provider: string;
  orderDate: number;
  medName: string;
  quantity: number;
  isAssigned: boolean;
  status: number; // Use number for status to match the API output
}

interface Order extends ProviderOrder {}

export default function ProviderOrdersTable() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [orders, setOrders] = useState<ProviderOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false); // State for managing the dialog

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
      setOrders(result);
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

  const handleAssignClick = (order: Order) => {
    setSelectedOrder(order);
    setDialogOpen(true); // Open the dialog when the "Assign to Provider" button is clicked
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
                  <TableRow key={order.orderId}>
                    <TableCell>{order.orderId.toString()}</TableCell>
                    <TableCell>{order.medName}</TableCell>
                    <TableCell>{order.quantity.toString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusString(order.status) == "Pending"
                        ? "text-secondary dark:text-primary rounded-sm bg-yellow-700"
                        : "text-secondary dark:text-primary rounded-sm bg-green-700"
                      }>
                        {getStatusString(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleAssignClick(order)}
                      >
                        Assign to Provider
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Order</DialogTitle>
              </DialogHeader>
              {selectedOrder && (
                <AssignToProviderForm
                  order={selectedOrder}
                  onClose={() => {
                    setSelectedOrder(null);
                    setDialogOpen(false);
                  }}
                />
              )}
            </DialogContent>
          </Dialog>
        </CardContent>
      </ScrollArea>
      <Toaster />
    </Card>
  );
}

interface AssignToProviderFormProps {
  order: Order;
  onClose: () => void;
}

function AssignToProviderForm({ order, onClose }: AssignToProviderFormProps) {
  const [batchID, setBatchID] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { client } = useSmartAccountClient({
    type: accountType,
    gasManagerConfig,
    opts,
  });

  const {
    sendUserOperation,
    isSendingUserOperation,
    error: isSendUserOperationError,
    sendUserOperationResult,
  } = useSendUserOperation({ client, waitForTxn: true });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!batchID.trim()) {
      console.error("Batch ID cannot be empty.");
      return;
    }

    const uoCallData = encodeFunctionData({
      abi: ContractAbi,
      functionName: "assignBatchToProvider",
      args: [batchID, order.provider, order.orderId],
    });

    if (!client || !uoCallData) {
      console.error("Client not initialized or uoCallData is null");
      return;
    }

    setIsLoading(true);
    try {
      await sendUserOperation({
        uo: {
          target: ContractAddress,
          data: uoCallData,
        },
      });
      toast.success("Batch assigned to provider successfully.");

    } catch (error) {
      console.error("Error assigning batch to provider:", error);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Enter Batch ID"
          value={batchID}
          onChange={(e) => setBatchID(e.target.value)}
          className="mb-2 bg-secondary"
          required
        />
        <Button type="submit" disabled={isLoading} className="mt-4">
          {isLoading ? "Assigning..." : "Assign"}
        </Button>
        <Button variant="destructive" type="button" onClick={onClose} className="ml-2">
          Cancel
        </Button>
    </form>
  );
}
