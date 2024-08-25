"use client";

import { FormEvent, useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { encodeFunctionData } from "viem";
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
} from "@/config";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "../ui/loading-spinner";
import { toast, Toaster } from "sonner";

export default function CreateBatchForm(props: any) {
  const [rfidUID, setRfidUID] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [medicineName, setMedicineName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingRFID, setLoadingRFID] = useState<boolean>(false);
  const [qrCode, setQrCode] = useState<string | null>(null);

  const { address } = useAccount({ type: accountType });
  const { client } = useSmartAccountClient({
    type: accountType,
    gasManagerConfig,
    opts,
  });

  const generateQrCode = (batchId: string) => {
    // Construct the full URL for the user dashboard
    const userDashboardUrl = `${window.location.origin}/consumerview/${batchId}`;
    
    // Set the QR code value to this URL
    setQrCode(userDashboardUrl);
  };

  const {
    sendUserOperation,
    sendUserOperationResult,
    isSendingUserOperation,
    error: isSendUserOperationError,
  } = useSendUserOperation({ client, waitForTxn: true });

  // useEffect(() => {
  //   if (!isSendingUserOperation && sendUserOperationResult) {
  //     window.location.reload();
  //   }
  // }, [isSendingUserOperation]);

  const createNewBatch = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setIsLoading(true);
  
    try {
      // Convert expiry date to timestamp
      const expiryTimestamp = Math.floor(new Date(expiryDate).getTime() / 1000);
  
      // Encode function data for blockchain call
      const uoCallData = client
        ? encodeFunctionData({
            abi: ContractAbi,
            functionName: "createBatch",
            args: [medicineName, rfidUID, expiryTimestamp, quantity],
          })
        : null;
  
      if (!client || !uoCallData) {
        console.error("Client not initialized or uoCallData is null");
        setIsLoading(false);
        return;
      }
  
      // Send the transaction to the blockchain
      sendUserOperation({
        uo: {
          target: ContractAddress,
          data: uoCallData,
        },
      });
  
      console.log("Batch created on blockchain by address:", address);
      toast.success("Batch created on blockchain successfully");
  
      // After successful blockchain transaction, save the batch to the database
      const response = await fetch("/api/batches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rfidUID,
          medicineName,
          expiryDate,
        }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        console.log("Batch saved to database with batchId:", data.batchId);
        generateQrCode(data.batchId);
      } else {
        toast.error("Failed to save batch to database");
      }
    } catch (error) {
      console.error("Error creating batch:", error);
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
      // setTimeout(() => {
      //   window.location.reload();
      // }, 5000);
    }
  };
  

  const scanRfid = async () => {
    setLoadingRFID(true); // Start loading
    try {
      const response = await fetch("/api/scan-rfid");
      const text = await response.text();
      setRfidUID(text);
      toast.success("RFID scanned successfully");
    } catch (error) {
      console.error("Error scanning RFID:", error);
    } finally {
      setLoadingRFID(false); // End loading
    }
  };

  const scanRfidDummy = async () => {
    const arbitraryRfidUID = props.tempRFID;
    setRfidUID(arbitraryRfidUID);
  };

  const reloadWindow = () => {
    window.location.reload();
  }

  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle>Create New Batch</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={createNewBatch} className="space-y-4">
          <div>
            <label>Medicine Name</label>
            <Input
              className="bg-secondary"
              type="text"
              placeholder="Enter the name of the medicine"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex-grow">
              <label>RFID UID</label>
              <Input
                type="text"
                placeholder="Enter the RFID UID"
                value={rfidUID}
                onChange={(e) => setRfidUID(e.target.value)}
                className="mb-2 w-full bg-secondary"
              />
            </div>
            <Button
              variant="outline"
              type="button"
              onClick={scanRfidDummy}
              className="mb-2 self-end"
            >
              {loadingRFID ? <LoadingSpinner /> : "Scan RFID"}
            </Button>
          </div>
          <div>
            <label>Quantity</label>
            <Input
              type="number"
              placeholder="Enter the quantity of medicine"
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="mb-2 bg-secondary"
            />
          </div>
          <div>
            <label>Expiry Date</label>
            <Input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="mb-2 bg-secondary"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <LoadingSpinner /> : "Create Batch"}
          </Button>
        </form>
        {qrCode && (
          <div className="mt-4">
            <h3>QR Code for User Dashboard:</h3>
            <QRCodeCanvas value={qrCode} size={256} />
            <Button className="mt-4 w-full" onClick={reloadWindow}>Dismiss</Button>
          </div>
        )}
      </CardContent>
      <Toaster />
    </Card>
  );
}
