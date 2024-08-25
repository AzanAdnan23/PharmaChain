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

interface DistributorOrder {
  orderId: number;
  distributor: string;
  manufacturer: string;
  orderDate: number;
  batchId: number;
  medName: string;
  quantity: number;
  isAssigned: boolean;
  status: number;
}

const chartConfig = {
  quantity: {
    label: "Order Quantity",
  },
} satisfies ChartConfig;

export function DistributorChart() {
  const [topOrders, setTopOrders] = useState<DistributorOrder[]>([]);

  const { address } = useAccount({ type: accountType });

  const fetchOrderedBatches = async () => {
    if (!address) return;

    const PharmaChain = getContract({
      address: ContractAddress,
      abi: ContractAbi,
      client: publicClient,
    });

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
        status: Number(order.status),
      }));

      // Sort orders by quantity and take the top 5
      const sortedOrders = formattedOrders
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      setTopOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching created orders:", error);
    }
  };

  useEffect(() => {
    fetchOrderedBatches();
  }, [address]);

  const chartData = topOrders.map((order) => ({
    medicineName: order.medName,
    quantity: order.quantity,
    fill: "hsl(var(--chart-1))", // You can customize colors here
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Orders</CardTitle>
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
              fill="var(--color-bar)" // Customize this color or make it dynamic
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
