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
import { ScrollArea } from "@/components/ui/scroll-area";

interface DistributorOrder {
  orderId: number;
  distributor: string;
  manufacturer: string;
  manufacturerName?: string;
  manufacturerEmail?: string;
  orderDate: number;
  batchId: number;
  medName: string;
  quantity: number;
  isAssigned: boolean;
  status: string;
  orderApprovedDate: number;
}

enum OrderStatus {
  Pending,
  InTransit,
  Approved,
  Reached,
  Recalled,
}

export default function FulfilledDistributorsOrdersTable() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fulfilledOrders, setFulfilledOrders] = useState<DistributorOrder[]>(
    [],
  );
  const { address } = useAccount({ type: accountType });

  const fetchFullfiledOrders = async () => {
    setIsLoading(true);
    try {
      const PharmaChain = getContract({
        address: ContractAddress,
        abi: ContractAbi,
        client: publicClient,
      });

      const result: any = await PharmaChain.read.getFulfilledDistributorOrders([
        address,
      ]);
      const formattedOrders: DistributorOrder[] = result.map((order: any) => ({
        orderId: Number(order.orderId),
        distributor: order.distributor,
        manufacturer: order.manufacturer,
        orderDate: Number(order.orderDate),
        batchId: Number(order.batchId),
        medName: order.medName,
        quantity: Number(order.quantity),
        isAssigned: order.isAssigned,
        status: OrderStatus[order.status],
        orderApprovedDate: Number(order.orderApprovedDate),
      }));

      for (let order of formattedOrders) {
        const manufacturerDetails = await fetchManufacturerDetails(
          order.manufacturer,
        );
        order.manufacturerName = manufacturerDetails.name;
        order.manufacturerEmail = manufacturerDetails.email;
      }

      setFulfilledOrders(formattedOrders);
    } catch (error) {
      console.error("Error getting Fulfilled Orders", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchManufacturerDetails = async (manufacturerAddress: string) => {
    try {
      const PharmaChain = getContract({
        address: ContractAddress,
        abi: ContractAbi,
        client: publicClient,
      });
      const result = await PharmaChain.read.getUserInfo([manufacturerAddress]);
      const [companyName, contactInfo]: [string, string] = result as [
        string,
        string,
      ];
      return { name: companyName, email: contactInfo };
    } catch (error) {
      console.error("Error fetching manufacturer details:", error);
      return { name: "", email: "" };
    }
  };

  useEffect(() => {
    fetchFullfiledOrders();
  }, [address]);

  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000); // assuming the timestamp is in seconds
    return date.toLocaleString([], {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }); // returns date and time without seconds
  };

  return (
    <Card className="h-full">
      <ScrollArea className="h-full w-full">
        <CardHeader>
          <CardTitle>Fulfilled Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Medicine Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Manufacturer Name</TableHead>
                <TableHead>Manufacturer Email</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Order Approved Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : fulfilledOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-500">
                    No orders fulfilled.
                  </TableCell>
                </TableRow>
              ) : (
                fulfilledOrders.map((order) => (
                  <TableRow key={order.orderId}>
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell>{order.medName}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>{order.manufacturerName || "N/A"}</TableCell>
                    <TableCell>{order.manufacturerEmail || "N/A"}</TableCell>
                    <TableCell>{formatDateTime(order.orderDate)}</TableCell>
                    <TableCell>
                      {formatDateTime(order.orderApprovedDate)}
                    </TableCell>
                    <TableCell>{order.status}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
