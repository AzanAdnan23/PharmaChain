import { useEffect, useState } from "react";
import { getContract, encodeFunctionData } from "viem";
import {
  useAccount,
  useSendUserOperation,
  useSmartAccountClient,
} from "@alchemy/aa-alchemy/react";
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
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { toast, Toaster } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Batch {
  batchId: number;
  manufacturer: string;
  details: string;
  isQualityApproved: boolean;
  isQualityDisapproved: boolean;
  distributor: string;
  rfidUIDHash: string;
  isRecalled: boolean;
  manufactureDate: number;
  expiryDate: number;
  quantity: number;
  orderId: number;
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
  status: string;
  orderApprovedDate: number;
}

interface DistributorInfo {
  companyName: string;
  contactInfo: string; // Assuming this is the email
}

export default function OrdersFulfilledTable() {
  // Define all hooks at the top level
  const { address } = useAccount({ type: accountType });
  const { client } = useSmartAccountClient({
    type: accountType,
    gasManagerConfig,
    opts,
  });
  const { sendUserOperation, isSendingUserOperation, sendUserOperationResult } = useSendUserOperation({
    client,
    waitForTxn: true,
  });

  useEffect(() => {
    if (!isSendingUserOperation && sendUserOperationResult) {
      window.location.reload();
    }
  }, [isSendingUserOperation]);

  const [orders, setOrders] = useState<Batch[]>([]);
  const [distributorOrders, setDistributorOrders] = useState<{
    [key: number]: DistributorOrder;
  }>({});
  const [distributorInfo, setDistributorInfo] = useState<{
    [key: string]: DistributorInfo;
  }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecallLoading, setIsRecallLoading] = useState<boolean>(false);

  const fetchFullfiledOrders = async () => {
    if (!address) return;

    const PharmaChain = getContract({
      address: ContractAddress,
      abi: ContractAbi,
      client: publicClient,
    });

    setIsLoading(true);
    try {
      const result = await PharmaChain.read.getFulfilledBatches([address]);
      console.log("Getting Fulfilled Orders", result);

      const formattedOrders = (result as any[]).map((batch) => ({
        batchId: Number(batch.batchId),
        manufacturer: batch.manufacturer,
        details: batch.details,
        isQualityApproved: batch.isQualityApproved,
        isQualityDisapproved: batch.isQualityDisapproved,
        distributor: batch.distributor,
        rfidUIDHash: batch.rfidUIDHash,
        isRecalled: batch.isRecalled,
        manufactureDate: Number(batch.manufactureDate),
        expiryDate: Number(batch.expiryDate),
        quantity: Number(batch.quantity),
        orderId: Number(batch.orderId),
      }));

      setOrders(formattedOrders);

      // Fetch distributor order details and distributor info for each batch
      for (const order of formattedOrders) {
        fetchDistributorOrder(order.orderId);
        fetchDistributorInfo(order.distributor);
      }
    } catch (error) {
      console.error("Error fetching fulfilled orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDistributorOrder = async (orderId: number) => {
    try {
      const PharmaChain = getContract({
        address: ContractAddress,
        abi: ContractAbi,
        client: publicClient,
      });

      const result: any = await PharmaChain.read.getDistributorOrder([orderId]);
      const resultDistributor: DistributorOrder = {
        orderId: Number(result.orderId),
        distributor: result.distributor,
        manufacturer: result.manufacturer,
        orderDate: Number(result.orderDate),
        batchId: Number(result.batchId),
        medName: result.medName,
        quantity: Number(result.quantity),
        isAssigned: result.isAssigned,
        status: result.status,
        orderApprovedDate: Number(result.orderApprovedDate),
      };

      setDistributorOrders((prevOrders) => ({
        ...prevOrders,
        [orderId]: resultDistributor,
      }));
    } catch (error) {
      console.error("Error fetching distributor order:", error);
    }
  };

  const fetchDistributorInfo = async (distributorAddress: string) => {
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

      setDistributorInfo((prevInfo) => ({
        ...prevInfo,
        [distributorAddress]: { companyName, contactInfo },
      }));
    } catch (error) {
      console.error("Error fetching distributor info:", error);
    }
  };

  useEffect(() => {
    fetchFullfiledOrders();
  }, [address]);

  const handleRecall = async (batchId: number) => {
    setIsRecallLoading(true);
    try {
      if (!client) {
        console.error("Client not initialized");
        return;
      }

      const uoCallData = encodeFunctionData({
        abi: ContractAbi,
        functionName: "recallBatch",
        args: [batchId],
      });

      await sendUserOperation({
        uo: {
          target: ContractAddress,
          data: uoCallData,
        },
      });

      console.log("Batch recalled successfully");
      toast.success("Batch recalled successfully");
      fetchFullfiledOrders(); // Refresh the orders list after recall
    } catch (error) {
      console.error("Error recalling batch:", error);
    } finally {
      setIsRecallLoading(false);
    }
  };

  return (
    <Card className="h-full">
      <ScrollArea className="w-full h-full">
      <CardHeader>
        <CardTitle>Orders Fulfilled</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch ID</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Distributor</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Order Approved Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) :
                orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500">
                      No orders fulfilled.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.batchId}>
                      <TableCell>{order.batchId}</TableCell>
                      <TableCell>{order.details}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>
                        {distributorInfo[order.distributor] ? (
                          <>
                            <div>
                              {distributorInfo[order.distributor].companyName}
                            </div>
                            <div>
                              {distributorInfo[order.distributor].contactInfo}
                            </div>
                          </>
                        ) : (
                          "Loading..."
                        )}
                      </TableCell>
                      <TableCell>
                        {distributorOrders[order.orderId]
                          ? new Date(
                            distributorOrders[order.orderId].orderDate * 1000,
                          ).toLocaleString()
                          : "Loading..."}
                      </TableCell>
                      <TableCell>
                        {distributorOrders[order.orderId]
                          ? new Date(
                            distributorOrders[order.orderId].orderApprovedDate *
                            1000,
                          ).toLocaleString()
                          : "Loading..."}
                      </TableCell>
                      <TableCell>
                        {order.isRecalled ? (
                          <Badge className="text-secondary dark:text-primary rounded-sm bg-red-700">
                            Recalled
                          </Badge>
                        ) : (
                          <Button
                            variant="outline"
                            onClick={() => handleRecall(order.batchId)}
                            disabled={isRecallLoading}
                          >
                            {isRecallLoading ? "Recalling..." : "Recall"}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <Toaster />
      </ScrollArea>
    </Card>
  );
}
