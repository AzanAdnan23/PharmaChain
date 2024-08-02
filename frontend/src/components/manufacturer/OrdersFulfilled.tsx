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
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

interface Batch {
  batchId: number;
  manufacturer: string;
  details: string;
  isQualityApproved: boolean;
  isQualityDisapproved: boolean;
  distributor: string;
  rfidUIDHash: string;
  isRecalled: boolean;
  manufactureDate: number;
  expiryDate: number;
  quantity: number;
  orderId: number;
}

export default function OrdersFulfilledTable() {
  const [orders, setOrders] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecallLoading, setIsRecallLoading] = useState<boolean>(false);

  const { address } = useAccount({ type: accountType });

  const fetchFullfiledOrders = async () => {
    if (!address) return;

    const PharmaChain = getContract({
      address: ContractAddress,
      abi: ContractAbi,
      client: publicClient,
    });

    setIsLoading(true);
    try {
      const result = await PharmaChain.read.getFulfilledBatches([address]);
      console.log("Getting Fulfilled Orders", result);

      const formattedOrders = (result as any[]).map((batch) => ({
        batchId: Number(batch.batchId),
        manufacturer: batch.manufacturer,
        details: batch.details,
        isQualityApproved: batch.isQualityApproved,
        isQualityDisapproved: batch.isQualityDisapproved,
        distributor: batch.distributor,
        rfidUIDHash: batch.rfidUIDHash,
        isRecalled: batch.isRecalled,
        manufactureDate: Number(batch.manufactureDate),
        expiryDate: Number(batch.expiryDate),
        quantity: Number(batch.quantity),
        orderId: Number(batch.orderId),
      }));

      setOrders(formattedOrders);
    } catch (error) {
      console.error("Error fetching fulfilled orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFullfiledOrders();
  }, [address]);

  const handleRecall = async (batchId: number) => {
    setIsRecallLoading(true);
    try {
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

      const uoCallData = client
        ? encodeFunctionData({
            abi: ContractAbi,
            functionName: "recallBatch",
            args: [batchId],
          })
        : null;
      if (!client || !uoCallData) {
        console.error("Client not initialized or uoCallData is null");
        return;
      }

      await sendUserOperation({
        uo: {
          target: ContractAddress,
          data: uoCallData,
        },
      });

      console.log("Batch recalled successfully");
      fetchFullfiledOrders(); // Refresh the orders list after recall
    } catch (error) {
      console.error("Error recalling batch:", error);
    } finally {
      setIsRecallLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders Fulfilled</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch ID</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Distributor</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Order Approved Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>No fulfilled orders found.</TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.batchId}>
                    <TableCell>{order.batchId}</TableCell>

                    <TableCell>{order.details}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>{order.distributor}</TableCell>
                    <TableCell>
                      {order.isRecalled ? "Recalled" : "Aproved"}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleRecall(order.batchId)}
                        disabled={isRecallLoading}
                      >
                        {isRecallLoading ? "Recalling..." : "Recall"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
