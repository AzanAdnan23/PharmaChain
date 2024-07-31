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

export default function OrdersFulfilledTable() {
  const orders = [
    {
      orderID: "O001",
      medicineName: "Ibuprofen",
      quantity: 30,
      distributor: "Distributor A",
      status: "Fulfilled",
    },
    // ... other orders
  ];

  const handleRecall = (orderID: string) => {
    // Handle recall action
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders Fulfilled</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Medicine Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Distributor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.orderID}>
                <TableCell>{order.orderID}</TableCell>
                <TableCell>{order.medicineName}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>{order.distributor}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>
                  <Button onClick={() => handleRecall(order.orderID)}>
                    Recall
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
