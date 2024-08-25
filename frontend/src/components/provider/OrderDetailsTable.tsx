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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

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

// Mapping function
const mapStatusNumberToEnum = (statusNumber: number): OrderStatus => {
  switch (statusNumber) {
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
      return OrderStatus.Pending; // Default case or handle invalid numbers
  }
};

export default function OrderDetailsTable() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [createdOrders, setCreatedOrders] = useState<ProviderOrder[]>([]);

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
      const result = await PharmaChain.read.getProviderOrders([address]);
      console.log("Getting Created Orders", result);

      const formattedOrders = (result as any[]).map((order) => ({
        orderId: Number(order.orderId),
        distributor: order.distributor,
        provider: order.provider,
        orderDate: Number(order.orderDate),
        batchId: Number(order.batchId),
        medName: order.medName,
        quantity: Number(order.quantity),
        isAssigned: order.isAssigned,
        status: mapStatusNumberToEnum(Number(order.status)), // Use the mapping function
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
      <ScrollArea className="w-full h-full">
      <CardHeader>
        <CardTitle>Order Details</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Medicine Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {createdOrders.map((order) => (
                <TableRow key={order.orderId}>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>{order.medName}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>
                    <Badge className={order.status === OrderStatus.Pending 
                      ? "text-secondary dark:text-primary rounded-sm bg-yellow-700" 
                      : "text-secondary dark:text-primary rounded-sm bg-green-700"}>
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      </ScrollArea>
    </Card>
  );
}
