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

interface StockItem {
  medName: string;
  quantity: number;
}

export default function StockTable() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);

  const { address } = useAccount({ type: accountType });

  const fetchStock = async () => {
    if (!address) return;

    const PharmaChain = getContract({
      address: ContractAddress,
      abi: ContractAbi,
      client: publicClient,
    });

    setIsLoading(true);
    try {
      const result = await PharmaChain.read.getDistributorStock([address]);
      console.log("Getting Distributor Stock", result);

      const formattedStock = (result as any[]).map((item) => ({
        medName: item.medName,
        quantity: Number(item.quantity),
      }));

      setStockItems(formattedStock);
    } catch (error) {
      console.error("Error fetching stock items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, [address]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingSpinner /> // Show a loading spinner while fetching data
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
                  <TableCell colSpan={2}>No stock items found.</TableCell>
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
    </Card>
  );
}
