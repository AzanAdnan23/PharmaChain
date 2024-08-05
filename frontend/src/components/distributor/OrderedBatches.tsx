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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "../ui/loading-spinner";

enum OrderStatus {
  Pending,
  InTransit,
  Approved,
  Reached,
  Recalled,
}

interface DistributorOrder {
  orderId: number;
  distributor: string;
  manufacturer: string;
  orderDate: number;
  batchId: number;
  medName: string;
  quantity: number;
  isAssigned: boolean;
  status: OrderStatus; // Enum type for status
}

export default function CreatedOrderBatches() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [createdOrders, setCreatedOrders] = useState<DistributorOrder[]>([]);

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
      const result = await PharmaChain.read.getDistributorOrders([address]);
      console.log("Getting Created Orders", result);

      const formattedOrders = (result as any[]).map((order) => ({
        orderId: Number(order.orderId),
        distributor: order.distributor,
        manufacturer: order.manufacturer,
        orderDate: Number(order.orderDate),
        batchId: Number(order.batchId),
        medName: order.medName,
        quantity: Number(order.quantity),
        isAssigned: order.isAssigned,
        status: Number(order.status) as OrderStatus, // Convert status to OrderStatus enum
      }));

      setCreatedOrders(formattedOrders);
    } catch (error) {
      console.error("Error fetching created orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderedBatches();
  }, [address]);

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
                <TableHead>Status</TableHead>
                <TableHead>Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {createdOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4}>No orders found.</TableCell>
                </TableRow>
              ) : (
                createdOrders.map((order) => (
                  <TableRow key={order.orderId}>
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell>{order.medName}</TableCell>
                    <TableCell>{OrderStatus[order.status]}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
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
