import { useState } from "react";
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

import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";

export default function OutgoingRFID(props: any) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingRFID, setLoadingRFID] = useState<boolean>(false);
  const [rfidUID, setRfidUID] = useState<string | null>(null);

  const { address } = useAccount({ type: accountType });
  const { client } = useSmartAccountClient({
    type: accountType,
    gasManagerConfig,
    opts,
  });

  const { sendUserOperation, error: isSendUserOperationError } = useSendUserOperation({
    client,
    waitForTxn: true,
  });

  const checkIsOrderIdExist = async (rfidUID: string): Promise<boolean> => {
    const PharmaChain = getContract({
      address: ContractAddress,
      abi: ContractAbi,
      client: publicClient,
    });

    try {
      console.log("Fetching orders with RFID UID:", rfidUID);
      const result = await PharmaChain.read.getProviderOrderByRFID([
        rfidUID,
      ]);
      console.log("Order ID fetched successfully:", result);
      return result !== 0; // Check if result is not zero
    } catch (error) {
      console.error("Error fetching order ID:", error);
      return false;
    }
  };

  const orderStatusEnum = {
    Reached: 3,
  };

  const updateStatus = async (rfidUID: string) => {
    const orderStatus = orderStatusEnum.Reached;

    const uoCallData = client
      ? encodeFunctionData({
          abi: ContractAbi,
          functionName: "updateProviderOrderStatusByRFID",
          args: [rfidUID, orderStatus],
        })
      : null;

    if (!client || !uoCallData) {
      console.error("Client not initialized or uoCallData is null");
      return;
    }

    setIsLoading(true);
    try {
      const result = await sendUserOperation({
        uo: {
          target: ContractAddress,
          data: uoCallData,
        },
      });

      if (isSendUserOperationError) {
        console.error("User operation error:", isSendUserOperationError);
        toast.error("Error updating order");
        return;
      }

      console.log("Order Updated successfully", address);
      toast.success("Order Updated successfully");

      // Now, update the status in MongoDB
      const updateResponse = await fetch(`/api/batches`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rfidUID: rfidUID,
          updateData: {
            "events.providerIncomingRFID": true,
            "timestamps.providerIncomingRFIDAt": new Date(),
          },
        }),
      });

      const updateData = await updateResponse.json();
      if (updateData.success) {
        console.log("Batch status updated in database for RFID:", rfidUID);
        toast.success("Batch status updated in database");
      } else {
        toast.error("Failed to update batch status in database");
      }

    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Error updating order");
    } finally {
      setIsLoading(false);
      // Optional: Reload page or update UI
    }
  };

  const scanRfid = async () => {
    setLoadingRFID(true); // Start loading
    try {
      const response = await fetch("/api/scan-rfid");
      const rfidData = await response.text(); // Already in bytes32 format

      console.log("Scanned RFID Data:", rfidData);
      setRfidUID(rfidData); // Set the RFID data

      if (rfidData) {
        const orderExists = await checkIsOrderIdExist(rfidData);
        if (orderExists) {
          await updateStatus(rfidData);
        } else {
          toast.error("Order ID does not exist. Status not updated.");
        }
      } else {
        toast.error("RFID data is empty. Scanning failed.");
      }

      toast.success("RFID scanned successfully");
    } catch (error) {
      console.error("Error scanning RFID:", error);
      toast.error("Error scanning RFID");
    } finally {
      setLoadingRFID(false); // End loading
    }
  };

  const scanRfidDummy = async () => {
    setLoadingRFID(true); // Start loading
    try {
      const rfidData = props.tempRFID;
      setRfidUID(rfidData); // Set the RFID data

      if (rfidData) {
        const orderExists = await checkIsOrderIdExist(rfidData);
        if (orderExists) {
          await updateStatus(rfidData);
        } else {
          toast.error("Order ID does not exist. Status not updated.");
        }
      } else {
        toast.error("RFID data is empty. Scanning failed.");
      }

      toast.success("RFID scanned successfully");
    } catch (error) {
      console.error("Error scanning RFID:", error);
      toast.error("Error scanning RFID");
    } finally {
      setLoadingRFID(false); // End loading
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>RFID Scanning</CardTitle>
      </CardHeader>
      <CardContent>
      <Button onClick={scanRfid} className="w-full">
        Scan Incoming RFID
      </Button>

      <div className="p-4 text-gray-500">Incoming RFID: {rfidUID}</div>

      <Toaster />
      </CardContent>
    </Card>
  );
}
