"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { getContract } from "viem";
import { useAccount } from "@alchemy/aa-alchemy/react";
import { accountType, ContractAddress, ContractAbi, publicClient } from "@/config";

interface Batch {
  batchId: number;
  manufacturer: string;
  details: string;
  qualityApproved: boolean;
  QualityDisapproved: boolean;
  distributor: string;
  rfidUIDHash: string;
  isRecalled: boolean;
  manufactureDate: number;
  expiryDate: number;
  quantity: number;
}

const chartConfig = {
  visitors: {
    label: "Quantity",
  },
} satisfies ChartConfig;

export function ManufacturerChart() {
  const [batchData, setBatchData] = useState<{ name: string; quantity: number }[]>([]);

  const { address } = useAccount({ type: accountType });

  const fetchCreatedBatches = async () => {
    if (!address) return;

    const PharmaChain = getContract({
      address: ContractAddress,
      abi: ContractAbi,
      client: publicClient,
    });

    try {
      const result = await PharmaChain.read.getCreatedBatches([address]);

      // Convert the result to the correct format and sort by quantity
      const formattedBatches = (result as any[]).map((batch) => ({
        name: batch.details,
        quantity: Number(batch.quantity),
      }));

      // Sort and take the top 5 batches based on quantity
      const topBatches = formattedBatches
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      setBatchData(topBatches);
    } catch (error) {
      console.error("Error fetching created batches:", error);
    }
  };

  useEffect(() => {
    fetchCreatedBatches();
  }, [address]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Batches by Quantity</CardTitle>
        <CardDescription>Based on Quantity</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={batchData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
  dataKey="quantity"
  fill="hsl(var(--chart-1))"
  strokeWidth={2}
  radius={8}
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
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Showing the top 5 batches <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Based on the latest batch data
        </div>
      </CardFooter>
    </Card>
  );
}
