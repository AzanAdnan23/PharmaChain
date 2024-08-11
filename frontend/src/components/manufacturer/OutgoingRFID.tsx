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

export default function OutgoingRFID() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingRFID, setLoadingRFID] = useState<boolean>(false);
  const [rfidUID, setRfidUID] = useState<string | null>(null);

  const { address } = useAccount({ type: accountType });
  const { client } = useSmartAccountClient({
    type: accountType,
    gasManagerConfig,
    opts,
  });

  const checkIsOrderIdExist = async (): Promise<boolean> => {
    const PharmaChain = getContract({
      address: ContractAddress,
      abi: ContractAbi,
      client: publicClient,
    });

    try {
      // Ensure the RFID UID is a valid bytes32 format
      const formattedRfidUID = `0x${rfidUID?.padStart(64, "0")}`;

      const result = await PharmaChain.read.getProviderOrderByRFID([
        formattedRfidUID,
      ]);
      return result !== 0; // Check if result is not zero
    } catch (error) {
      console.error("Error fetching order ID:", error);
      return false;
    }
  };

  const orderStatusEnum = {
    InTransit: 1,
  };

  const { sendUserOperation } = useSendUserOperation({
    client,
    waitForTxn: true,
  });

  const updateStatus = async () => {
    const orderStatus = orderStatusEnum.InTransit;
    const uoCallData = client
      ? encodeFunctionData({
          abi: ContractAbi,
          functionName: "updateDistributorOrderStatusByRFID",
          args: [`0x${rfidUID?.padStart(64, "0")}`, orderStatus],
        })
      : null;

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
      console.log("Order Updated successfully", address);
      toast.success("Order Updated successfully");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Error updating order");
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    }
  };

  const scanRfid = async () => {
    setLoadingRFID(true); // Start loading
    try {
      const response = await fetch("/api/scan-rfid");
      const text = await response.text();
      setRfidUID(text);

      const orderExists = await checkIsOrderIdExist();
      if (orderExists) {
        await updateStatus();
      } else {
        toast.error("Order ID does not exist. Status not updated.");
      }

      toast.success("RFID scanned successfully");
    } catch (error) {
      console.error("Error scanning RFID:", error);
    } finally {
      setLoadingRFID(false); // End loading
    }
  };

  return (
    <>
      <Button onClick={scanRfid} className="mt-4">
        Scan Outgoing RFID
      </Button>

      <div className="p-4 text-gray-500">Outgoing RFID: {rfidUID}</div>

      <Toaster />
    </>
  );
}
