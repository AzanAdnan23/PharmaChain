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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

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

export default function CurrentOrderBatches() {
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
    <Card className="h-full">
      <ScrollArea className="h-full w-full">
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
                  <TableHead>Batch ID</TableHead>
                  <TableHead>Medicine Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) :
                  createdOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-gray-500">
                        No current orders.
                      </TableCell>
                    </TableRow>
                  ) : (
                    createdOrders.map((order) => (
                      <TableRow key={order.orderId}>
                        <TableCell>{order.orderId}</TableCell>
                        <TableCell>{order.batchId === 0 ? "Not Assigned" : order.batchId}</TableCell>
                        <TableCell>{order.medName}</TableCell>
                        <TableCell>
                            <Badge className={OrderStatus[order.status] == "Pending"
                              ? "text-secondary dark:text-primary rounded-sm bg-yellow-700"
                              : "text-secondary dark:text-primary rounded-sm bg-green-700"
                            }>
                              {OrderStatus[order.status]}
                            </Badge>
                        </TableCell>
                        <TableCell>{order.quantity}</TableCell>
                      </TableRow>
                    ))
                  )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
