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

interface StockItem {
  medName: string;
  quantity: number;
}

export default function StockTable() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { address } = useAccount({ type: accountType });

  const fetchStock = async () => {
    if (!address) return;

    const PharmaChain = getContract({
      address: ContractAddress,
      abi: ContractAbi,
      client: publicClient,
    });

    setIsLoading(true);
    setError(null); // Reset error state

    try {
      const result = await PharmaChain.read.getProviderStock([address]);
      console.log("Getting Providers Stock", result);

      const formattedStock = (result as any[]).map((item) => ({
        medName: item.medName,
        quantity: Number(item.quantity),
      }));

      setStockItems(formattedStock);
    } catch (error) {
      console.error("Error fetching stock items:", error);
      setError("Failed to load stock items.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, [address]);

  return (
    <Card className="h-full">
      <ScrollArea className="h-full w-full">
        <CardHeader>
          <CardTitle>Stock</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSpinner /> 
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicine Name</TableHead>
                  <TableHead>Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500">
                      Nothing in stock.
                    </TableCell>
                  </TableRow>
                ) : (
                  stockItems.map((item) => (
                    <TableRow key={item.medName}>
                      <TableCell>{item.medName}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
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
