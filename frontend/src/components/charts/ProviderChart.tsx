"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts";
import { getContract } from "viem";
import { useAccount } from "@alchemy/aa-alchemy/react";
import {
  accountType,
  ContractAddress,
  ContractAbi,
  publicClient,
} from "@/config";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

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

// Function to map status number to enum
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
      return OrderStatus.Pending;
  }
};

const chartConfig = {
  quantity: {
    label: "Order Quantity",
  },
} satisfies ChartConfig;

export function ProviderChart() {
  const [topOrders, setTopOrders] = useState<ProviderOrder[]>([]);

  const { address } = useAccount({ type: accountType });

  const fetchProviderOrders = async () => {
    if (!address) return;

    const PharmaChain = getContract({
      address: ContractAddress,
      abi: ContractAbi,
      client: publicClient,
    });

    try {
      const result = await PharmaChain.read.getProviderOrders([address]);
      console.log("Getting Provider Orders", result);

      const formattedOrders = (result as any[]).map((order) => ({
        orderId: Number(order.orderId),
        distributor: order.distributor,
        provider: order.provider,
        orderDate: Number(order.orderDate),
        batchId: Number(order.batchId),
        medName: order.medName,
        quantity: Number(order.quantity),
        isAssigned: order.isAssigned,
        status: mapStatusNumberToEnum(Number(order.status)),
      }));

      // Sort orders by quantity and take the top 5
      const sortedOrders = formattedOrders
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      setTopOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching provider orders:", error);
    }
  };

  useEffect(() => {
    fetchProviderOrders();
  }, [address]);

  const chartData = topOrders.map((order) => ({
    medicineName: order.medName,
    quantity: order.quantity,
    fill: "hsl(var(--chart-1))", // Customize the color here if needed
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Orders for Provider</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="medicineName"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="quantity"
              strokeWidth={2}
              radius={8}
              fill="hsl(var(--chart-1))" // Customize this color or make it dynamic
              activeIndex={2}
              activeBar={({ ...props }) => (
                <Rectangle
                  {...props}
                  fillOpacity={0.8}
                  stroke={props.payload.fill}
                  strokeDasharray={4}
                  strokeDashoffset={4}
                />
              )}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
