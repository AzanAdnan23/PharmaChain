import { FormEvent, useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "../ui/loading-spinner";
import { toast, Toaster } from "sonner";

export default function IncomingRFIDButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingRFID, setLoadingRFID] = useState<boolean>(false);
  const [rfidUID, setRfidUID] = useState("");

  const { address } = useAccount({ type: accountType });
  const { client } = useSmartAccountClient({
    type: accountType,
    gasManagerConfig,
    opts,
  });
  const orderStatusEnum = {
    Reached: 3,
  };

  const {
    sendUserOperation,
    sendUserOperationResult,
    isSendingUserOperation,
    error: isSendUserOperationError,
  } = useSendUserOperation({ client, waitForTxn: true });

  const orderstatus = orderStatusEnum.Reached; // Use the numeric value corresponding to the enum

  const updateStatus = async () => {
    const uoCallData = client
      ? encodeFunctionData({
          abi: ContractAbi,
          functionName: "updateDistributorOrderStatusByRFID",
          args: [rfidUID, orderstatus],
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
      // Refresh page after 5 seconds
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
      console.log("RFID UID:", text);
      toast.success("RFID scanned successfully");
      // Trigger status update after scanning
      await updateStatus();
    } catch (error) {
      console.error("Error scanning RFID:", error);
      toast.error("Error scanning RFID");
    } finally {
      setLoadingRFID(false); // End loading
    }
  };

  const scanRfidDummy = async () => {
    const arbitraryRfidUID =
      "0x00000000000000000000000000000000000000000000000000000000000004d2";
    setRfidUID(arbitraryRfidUID);
    await updateStatus();
  };

  return (
    <div>
      <Button
        onClick={scanRfid}
        className="mt-4"
        disabled={loadingRFID || isLoading}
      >
        {loadingRFID ? <LoadingSpinner /> : "Scan Incoming RFID"}
      </Button>
      <div className="p-4 text-gray-600">Incoming RFID: {rfidUID}</div>
      <Toaster />
    </div>
  );
}
