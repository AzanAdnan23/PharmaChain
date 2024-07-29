import { FormEvent, useState } from "react";
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

export default function CreateBatchForm() {
  const [rfidUID, setRfidUID] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [medicineName, setMedicineName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const createNewBatch = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    // Convert expiry date to timestamp
    const expiryTimestamp = Math.floor(new Date(expiryDate).getTime() / 1000);

    const uoCallData = client
      ? encodeFunctionData({
          abi: ContractAbi,
          functionName: "createBatch",
          args: [medicineName, rfidUID, expiryTimestamp, quantity],
          // rfid uid in btes32: 0x00000000000000000000000000000000000000000000000000000000000004d2
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
      console.log("Batch created successfully by this address", address);
    } catch (error) {
      console.error("Error creating batch:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Batch</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={createNewBatch} className="space-y-4">
          <div>
            <label>Medicine Name</label>
            <Input
              type="text"
              placeholder="Enter the name of the medicine"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
            />
          </div>
          <div>
            <label>Quantity</label>
            <Input
              type="number"
              placeholder="Enter the quantity of medicine"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="mb-2"
            />
          </div>
          <div>
            <label>Expiry Date</label>
            <Input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="mb-2"
            />
          </div>
          <div>
            <label>RFID UID</label>
            <Input
              type="text"
              placeholder="Enter the RFID UID"
              value={rfidUID}
              onChange={(e) => setRfidUID(e.target.value)}
              className="mb-2"
            />
          </div>

          <Button type="submit" className="mt-4" disabled={isLoading}>
            {isLoading ? <LoadingSpinner /> : "Create Batch"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
