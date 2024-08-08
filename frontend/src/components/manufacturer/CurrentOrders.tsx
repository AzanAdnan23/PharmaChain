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
import { LoadingSpinner } from "../ui/loading-spinner";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // Import Dialog components
import { Input } from "@/components/ui/input";
import { toast, Toaster } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Order {
  orderId: number;
  medName: string;
  quantity: number;
  status: string;
  distributorAddr: string;
}

// Enum to Status mapping
const statusMapping: { [key: number]: string } = {
  0: "Pending",
  1: "InTransit",
  2: "Approved",
  3: "Reached",
  4: "Recalled",
};

export default function CurrentOrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { address } = useAccount({ type: accountType });

  const fetchPendingOrders = async () => {
    if (!address) return;

    const PharmaChain = getContract({
      address: ContractAddress,
      abi: ContractAbi,
      client: publicClient,
    });

    setIsLoading(true);
    try {
      const result = await PharmaChain.read.getPendingDistributorOrders();
      console.log("Getting Pending Orders", result);

      const formattedOrders = (result as any[])
        .map((order) => ({
          orderId: Number(order.orderId),
          medName: order.medName,
          quantity: Number(order.quantity),
          status: statusMapping[order.status] || "Unknown",
          distributorAddr: order.distributor,
        }))
        .filter((order) => order.status === "Pending");

      setOrders(formattedOrders);
    } catch (error) {
      console.error("Error fetching pending orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingOrders();
  }, [address]);

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

  useEffect(() => {
    if (!isSendingUserOperation && sendUserOperationResult) {
      window.location.reload();
    }
  }, [isSendingUserOperation]);

  return (
    <Card className="h-full">
      <ScrollArea className="w-full h-full">
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>) :
                orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500">
                      No orders found.
                    </TableCell>
                  </TableRow>
                ) :

                  orders.map((order) => (
                    <TableRow key={order.orderId}>
                      <TableCell>{order.orderId}</TableCell>
                      <TableCell>{order.medName}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>
                        <Badge className="text-secondary dark:text-primary rounded-sm bg-yellow-700">
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" onClick={() => setSelectedOrder(order)}>
                              Assign to Distributor
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Assign Order</DialogTitle>
                            </DialogHeader>
                            {selectedOrder && (
                              <AssignToDistributorForm
                                order={selectedOrder}
                                onClose={() => {
                                  setSelectedOrder(null);
                                  setDialogOpen(false);
                                }}
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </CardContent>
        <Toaster />
      </ScrollArea>
    </Card>
  );
}

function AssignToDistributorForm({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) {
  const [batchID, setBatchID] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if batchID is empty
    if (!batchID.trim()) {
      console.error("Batch ID cannot be empty.");
      toast.error("Batch ID cannot be empty.");
      return;
    }

    // Encode the function data
    const uoCallData = encodeFunctionData({
      abi: ContractAbi,
      functionName: "assignToDistributor",
      args: [batchID, order.distributorAddr, order.orderId],
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

      console.log(
        "Assigning batch:",
        batchID,
        order.distributorAddr,
        order.orderId,
      );
      toast.success("Batch assigned to distributor successfully.");
    } catch (error) {
      console.error("Error assigning batch to distributor:", error);
      toast.error("Error assigning batch to distributor.");
    } finally {
      setIsLoading(false);
      onClose();
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Batch ID"
        value={batchID}
        onChange={(e) => setBatchID(e.target.value)}
        className="mb-2 bg-secondary"
        required
      />
      <Button type="submit" className="mt-4" disabled={isLoading}>
        {isLoading ? <LoadingSpinner /> : "Assign"}
      </Button>
      <Button variant="destructive" type="button" onClick={onClose} className="ml-2">
        Cancel
      </Button>
    </form>
  );
}
