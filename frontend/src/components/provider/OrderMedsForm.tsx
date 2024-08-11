import { useState } from "react";
import { useEffect } from "react";
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

export default function OrderMedsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [medicineName, setMedicineName] = useState("");
  const [quantity, setQuantity] = useState(0);

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

  useEffect(() => {
    if (!isSendingUserOperation && sendUserOperationResult) {
      window.location.reload();
    }
  }, [isSendingUserOperation]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!client) {
      console.error("Client not initialized");
      return;
    }

    const uoCallData = encodeFunctionData({
      abi: ContractAbi,
      functionName: "createProviderOrder",
      args: [medicineName, quantity],
    });

    if (!uoCallData) {
      console.error("uoCallData is null");
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
      console.log("Order created successfully by this address", address);
    } catch (error) {
      console.error("Error while creating order", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Medicines</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Medicine Name"
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
            className="mb-2"
            required
          />
          <Input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="1"
            required
          />
          <Button type="submit" className="w-full mt-4" disabled={isLoading}>
            {isLoading ? "Ordering..." : "Order"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
