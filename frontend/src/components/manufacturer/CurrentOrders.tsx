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
import { LoadingSpinner } from "../ui/loading-spinner";

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

      const formattedOrders = (result as any[]).map((order) => ({
        orderId: Number(order.orderId),
        medName: order.medName,
        quantity: Number(order.quantity),
        status: statusMapping[order.status] || "Unknown", // Map the status
        distributorAddr: order.distributor,
      }));

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

  const handleAssign = async (orderId: number, batchId: string) => {
    // Find the selected order's distributor address
    const selectedOrder = orders.find((order) => order.orderId === orderId);
    if (!selectedOrder) return;

    const distributorAddress = selectedOrder.distributorAddr;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingSpinner /> // Show a loading spinner while fetching data
        ) : (
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
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>No pending orders found.</TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow
                    key={order.orderId}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell>{order.medName}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>
                      <Button onClick={() => setSelectedOrder(order)}>
                        Assign to Distributor
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
        {selectedOrder && (
          <AssignToDistributorForm
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onAssign={handleAssign}
          />
        )}
      </CardContent>
    </Card>
  );
}

function AssignToDistributorForm({
  order,
  onClose,
  onAssign,
}: {
  order: Order;
  onClose: () => void;
  onAssign: (orderId: number, batchId: string) => void;
}) {
  const [batchID, setBatchID] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false); // Local loading state

  const { address } = useAccount({ type: accountType });
  const { client } = useSmartAccountClient({
    type: accountType,
    gasManagerConfig,
    opts,
  });
  const {
    sendUserOperation,
    sendUserOperationResult,
    isSendingUserOperation,
    error: isSendUserOperationError,
  } = useSendUserOperation({ client, waitForTxn: true });

  console.log(
    " Assigning batch thingies",
    batchID,
    order.distributorAddr,
    order.orderId,
  );

  const uoCallData = client
    ? encodeFunctionData({
        abi: ContractAbi,
        functionName: "assignToDistributor",
        args: [batchID, order.distributorAddr, order.orderId],
      })
    : null;
  if (!client || !uoCallData) {
    console.error("Client not initialized or uoCallData is null");
    return;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    await onAssign(order.orderId, batchID);

    try {
      sendUserOperation({
        uo: {
          target: ContractAddress,
          data: uoCallData,
        },
      });
      console.log("Order assigned successfully", isSendUserOperationError);
    } catch (error) {
      console.error("Error assigning batch:", error);
    } finally {
      setIsLoading(false);
    }

    onClose(); // Close the form after submission
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
            disabled={isLoading} // Disable input if loading
          />
          <Button type="submit" className="mt-4" disabled={isLoading}>
            {isLoading ? "Assigning..." : "Assign"}
          </Button>
          <Button type="button" onClick={onClose} className="ml-2">
            Cancel
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
