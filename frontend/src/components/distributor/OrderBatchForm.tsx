import { useState, useEffect } from "react";
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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";

interface FormData {
  medicineName: string;
  orderQuantity: number;
}

const OrderBatchForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // Import the reset method
  } = useForm<FormData>();
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    error: isSendUserOperationError
  } = useSendUserOperation({ client, waitForTxn: true, });

  useEffect(() => {
    if (!isSendingUserOperation && sendUserOperationResult) {
      window.location.reload();
    }
  }, [isSendingUserOperation]);

  const onSubmit = async (data: FormData) => {
    const { medicineName, orderQuantity } = data;
    if (!client) {
      console.error("Client not initialized");
      return;
    }

    const uoCallData = encodeFunctionData({
      abi: ContractAbi,
      functionName: "createDistributorOrder",
      args: [medicineName, orderQuantity],
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
      setSubmitted(true);
      toast.success("Order created successfully");

      // Reset form fields after successful order
      reset();
    } catch (error) {
      console.error("Error creating order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Batch</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Medicine Name
            </label>
            <Input
              {...register("medicineName", {
                required: "Medicine name is required",
              })}
              placeholder="Enter medicine name"
              className="mt-1"
            />
            {errors.medicineName && (
              <p className="text-sm text-red-500">
                {errors.medicineName.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Order Quantity
            </label>
            <Input
              type="number"
              {...register("orderQuantity", {
                required: "Order quantity is required",
                min: { value: 1, message: "Order quantity must be at least 1" },
              })}
              placeholder="Enter order quantity"
              className="mt-1"
            />
            {errors.orderQuantity && (
              <p className="text-sm text-red-500">
                {errors.orderQuantity.message}
              </p>
            )}
          </div>
          <Button type="submit" className="" disabled={isLoading}>
            {isLoading ? "Placing Order..." : "Place Order"}
          </Button>
        </form>
      </CardContent>
      <Toaster />
    </Card>
  );
};

export default OrderBatchForm;
