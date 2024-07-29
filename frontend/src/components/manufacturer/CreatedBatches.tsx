import { useCallback, useEffect, useState } from "react";
import { getContract } from "viem";
import {
  useAccount,
  useUser,
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

interface Batch {
  batchId: number;
  manufacturer: string;
  details: string;
  qualityApproved: boolean;
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

  useEffect(() => {
    if (address) {
      const PharmaChain = getContract({
        address: ContractAddress,
        abi: ContractAbi,
        client: publicClient,
      });

      const fetchCreatedBatches = async () => {
        setIsLoading(true);
        try {
          const result = await PharmaChain.read.getCreatedBatches([address]);
          console.log(address);
          console.log("Getting Created Batches", result);

          // Convert the result to the correct format
          const formattedBatches = (result as any[]).map((batch) => ({
            batchId: Number(batch.batchId),
            manufacturer: batch.manufacturer,
            details: batch.details,
            qualityApproved: batch.qualityApproved,
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

      fetchCreatedBatches();
    }
  }, [address]);

  const handleAccept = (batchID: number) => {
    // Handle accept action
  };

  const handleReject = (batchID: number) => {
    // Handle reject action
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Created Batches</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
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
              {createdBatches.map((batch) => (
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
                      "Approved"
                    ) : (
                      <>
                        <Button onClick={() => handleAccept(batch.batchId)}>
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleReject(batch.batchId)}
                          className="ml-2"
                        >
                          Disapprove
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
