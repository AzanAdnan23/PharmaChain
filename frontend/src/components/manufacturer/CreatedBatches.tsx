import { FormEvent, useState } from "react";
import { encodeFunctionData } from "viem";
import {
  useAccount,
  useSendUserOperation,
  useSmartAccountClient,
  useUser,
} from "@alchemy/aa-alchemy/react";
import {
  accountType,
  gasManagerConfig,
  accountClientOptions as opts,
  ContractAddress,
  ContractAbi,
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

export default function CreatedBatchesTable() {
  // Example data; replace with real data
  const batches = [
    {
      batchID: "001",
      medicineName: "Aspirin",
      quantity: 100,
      status: "Created",
    },
    // ... other batches
  ];

  const handleAccept = (batchID: string) => {
    // Handle accept action
  };

  const handleReject = (batchID: string) => {
    // Handle reject action
  };

  return (
    <Card>
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
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batches.map((batch) => (
              <TableRow key={batch.batchID}>
                <TableCell>{batch.batchID}</TableCell>
                <TableCell>{batch.medicineName}</TableCell>
                <TableCell>{batch.quantity}</TableCell>
                <TableCell>{batch.status}</TableCell>
                <TableCell>
                  <Button onClick={() => handleAccept(batch.batchID)}>
                    Accept
                  </Button>
                  <Button
                    onClick={() => handleReject(batch.batchID)}
                    className="ml-2"
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
