import { useEffect, useState } from "react";
import { getContract } from "viem";
import { useAccount } from "@alchemy/aa-alchemy/react";
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProvidersOrder {
  medName: string;
  quantity: number;
  orderId: number;
  batchId: number;
  provider: string;
  distributor: string;
  distributorName: string;
  distributorEmail: string;
  isAssigned: boolean;
  orderDate: number;
  orderApprovedDate: number;
  status: OrderStatus;
}

enum OrderStatus {
  Pending,
  InTransit,
  Approved,
  Reached,
  Recalled,
}

export default function FulfilledProviderOrdersTable() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fulfilledOrders, setFulfilledOrders] = useState<ProvidersOrder[]>([]);

  const { address } = useAccount({ type: accountType });

  const fetchDistributorDetails = async (distributorAddress: string) => {
    try {
      const PharmaChain = getContract({
        address: ContractAddress,
        abi: ContractAbi,
        client: publicClient,
      });
      const result = await PharmaChain.read.getUserInfo([distributorAddress]);
      const [companyName, contactInfo]: [string, string] = result as [
        string,
        string,
      ];
      console.log(
        " fetching distribooter details in fullfiled provider:",
        result,
      );
      return { name: companyName, email: contactInfo };
    } catch (error) {
      console.error("Error fetching distributor details:", error);
      return { name: "", email: "" };
    }
  };

  const fetchFullfiledOrders = async () => {
    setIsLoading(true);
    try {
      const PharmaChain = getContract({
        address: ContractAddress,
        abi: ContractAbi,
        client: publicClient,
      });

      const result: any = await PharmaChain.read.getProviderOrders([address]);

      const mappedOrders = await Promise.all(
        result.map(async (order: any) => {
          const { name, email } = await fetchDistributorDetails(
            order.distributor,
          );

          // Convert BigInt values to numbers before performing operations
          const orderDate = Number(order.orderDate) * 1000;
          const orderApprovedDate = Number(order.orderApprovedDate) * 1000;

          return {
            orderId: Number(order.orderId),
            medName: order.medName,
            quantity: Number(order.quantity),
            distributor: order.distributor,
            distributorName: name,
            distributorEmail: email,
            orderDate: new Date(orderDate).toLocaleDateString(),
            orderApprovedDate: new Date(orderApprovedDate).toLocaleDateString(),
            status: OrderStatus[order.status],
          };
        }),
      );
      console.log("fetching providers fullfiled orders:", result);

      setFulfilledOrders(mappedOrders);
    } catch (error) {
      console.error("Error getting Fulfilled Orders", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFullfiledOrders();
  }, [address]);

  return (
    <Card className="h-full">
      <ScrollArea className="w-full h-full">
        <CardHeader>
          <CardTitle>Fulfilled Provider Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Medicine Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Distributor Name</TableHead>
                <TableHead>Distributor Email</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Order Approve Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fulfilledOrders.map(
                ({
                  orderId,
                  medName,
                  quantity,
                  distributorName,
                  distributorEmail,
                  orderDate,
                  orderApprovedDate,
                  status,
                }) => (
                  <TableRow key={orderId}>
                    <TableCell>{orderId}</TableCell>
                    <TableCell>{medName}</TableCell>
                    <TableCell>{quantity}</TableCell>
                    <TableCell>{distributorName}</TableCell>
                    <TableCell>{distributorEmail}</TableCell>
                    <TableCell>{orderDate}</TableCell>
                    <TableCell>{orderApprovedDate}</TableCell>
                    <TableCell>{status}</TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
