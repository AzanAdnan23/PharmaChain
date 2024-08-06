"use client";

import { useEffect, useState } from "react";
import { encodeFunctionData, getContract } from "viem";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast, Toaster } from 'sonner';
import { Badge } from "@/components/ui/badge";

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

export default function CreatedBatchesTable() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [createdBatches, setCreatedBatches] = useState<Batch[]>([]);

  const { address } = useAccount({ type: accountType });

  const fetchCreatedBatches = async () => {
    if (!address) return;

    const PharmaChain = getContract({
      address: ContractAddress,
      abi: ContractAbi,
      client: publicClient,
    });

    setIsLoading(true);
    try {
      const result = await PharmaChain.read.getCreatedBatches([address]);
      console.log("Getting Created Batches", result);

      // Convert the result to the correct format
      const formattedBatches = (result as any[]).map((batch) => ({
        batchId: Number(batch.batchId),
        manufacturer: batch.manufacturer,
        details: batch.details,
        qualityApproved: batch.isQualityApproved,
        QualityDisapproved: batch.isQualityDisapproved,
        distributor: batch.distributor,
        rfidUIDHash: batch.rfidUIDHash,
        isRecalled: batch.isRecalled,
        manufactureDate: Number(batch.manufactureDate),
        expiryDate: Number(batch.expiryDate),
        quantity: Number(batch.quantity),
      }));

      setCreatedBatches(formattedBatches);
    } catch (error) {
      console.error("Error fetching created batches:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCreatedBatches();
  }, [address]);

  const { client } = useSmartAccountClient({
    type: accountType,
    gasManagerConfig,
    opts,
  });
  const {
    sendUserOperation,
    isSendingUserOperation,
    error: isSendUserOperationError,
    sendUserOperationResult,
  } = useSendUserOperation({ client, waitForTxn: true });

  useEffect(() => {
    if (!isSendingUserOperation && sendUserOperationResult) {
      window.location.reload();
    }
  }, [isSendingUserOperation]);

  const handleAccept = async (batchID: number) => {
    const uoCallData = encodeFunctionData({
      abi: ContractAbi,
      functionName: "approveQuality",
      args: [batchID],
    });

    if (!client || !uoCallData) {
      console.error("Client not initialized or uoCallData is null");
      return;
    }

    setIsLoading(true);
    try {
      await sendUserOperation({
        uo: {
          target: ContractAddress,
          data: uoCallData,
        },
      });
      console.log("Batch Quality Approved by this address", address);
      await fetchCreatedBatches(); // Refetch data after operation
      toast.success('Batch quality approved successfully');
    } catch (error) {
      console.error("Error approving quality of batch:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (batchID: number) => {
    const uoCallData = encodeFunctionData({
      abi: ContractAbi,
      functionName: "disapproveQuality",
      args: [batchID],
    });

    if (!client || !uoCallData) {
      console.error("Client not initialized or uoCallData is null");
      return;
    }

    setIsLoading(true);
    try {
      await sendUserOperation({
        uo: {
          target: ContractAddress,
          data: uoCallData,
        },
      });
      console.log("Batch Quality Disapproved by this address", address);
      await fetchCreatedBatches(); // Refetch data after operation
      toast.success('Batch quality disapproved successfully');
    } catch (error) {
      console.error("Error disapproving quality of batch:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };

  return (
    <Card className="h-full">
      <ScrollArea className="w-full h-full">
        <CardHeader>
          <CardTitle>Created Batches</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch ID</TableHead>
                <TableHead>Medicine Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Manufacture Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Quality</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : createdBatches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    No batches found
                  </TableCell>
                </TableRow>
              ) : (
                createdBatches.map((batch) => (
                  <TableRow key={batch.batchId}>
                    <TableCell>{batch.batchId}</TableCell>
                    <TableCell>{batch.details}</TableCell>
                    <TableCell>{batch.quantity}</TableCell>
                    <TableCell>{formatDate(batch.manufactureDate)}</TableCell>
                    <TableCell>
                      {batch.isRecalled
                        ? "Recalled"
                        : batch.distributor ===
                          "0x0000000000000000000000000000000000000000"
                          ? "Not Assigned"
                          : "Assigned"}
                    </TableCell>
                    <TableCell>
                      {batch.qualityApproved ? (
                        <>
                          <span className="text-green-500">Approved</span>
                        </>
                      ) : batch.QualityDisapproved ? (
                        <>
                          <span className="text-red-500">Disapproved</span>
                        </>
                      ) : (
                        <>
                          <Button
                            onClick={() => handleAccept(batch.batchId)}
                            disabled={isSendingUserOperation}
                          >
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleReject(batch.batchId)}
                            className="ml-2"
                            disabled={isSendingUserOperation}
                          >
                            Disapprove
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        <Toaster />
      </ScrollArea>
    </Card>
  );
}
