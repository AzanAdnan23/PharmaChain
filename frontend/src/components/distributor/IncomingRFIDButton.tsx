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

  const {
    sendUserOperation,
    sendUserOperationResult,
    isSendingUserOperation,
    error: isSendUserOperationError,
  } = useSendUserOperation({ client, waitForTxn: true });

  const scanRfid = async () => {
    setLoadingRFID(true); // Start loading
    try {
      const response = await fetch("/api/scan-rfid");

      const text = await response.text();
      setRfidUID(text);
      console.log(" rfid uid:   ", rfidUID);
      toast.success("RFID scanned successfully");
    } catch (error) {
      console.error("Error scanning RFID:", error);
    } finally {
      setLoadingRFID(false); // End loading
    }
  };

  const scanRfidDummy = async () => {
    const arbitraryRfidUID =
      "0x00000000000000000000000000000000000000000000000000000000000004d2";
    setRfidUID(arbitraryRfidUID);
  };

  const handleScan = () => {
    // Handle incoming RFID scan
  };

  return (
    <Button onClick={scanRfid} className="mt-4">
      Scan Incoming RFID
    </Button>
  );
}
