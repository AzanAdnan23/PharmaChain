import React from "react";
import { FormEvent, useCallback, useEffect, useState } from "react";
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
  publicClient,
} from "@/config";
import { getContract, encodeFunctionData } from "viem";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { OpStatus } from "./op-status";

enum Role {
  Manufacturer,
  Distributor,
  Provider,
}

export const UserCheck = () => {
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCheckingRegistration, setIsCheckingRegistration] =
    useState<boolean>(false);

  const user = useUser();
  const { address } = useAccount({ type: accountType });

  const { client } = useSmartAccountClient({
    type: accountType,
    gasManagerConfig,
    opts,
  });

  const PharmaChain = getContract({
    address: ContractAddress,
    abi: ContractAbi,
    client: publicClient,
  });

  const onEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
    [],
  );

  const onRoleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => setRole(e.target.value),
    [],
  );

  const onCompanyNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setCompanyName(e.target.value),
    [],
  );

  const checkRegistrationStatus = useCallback(async () => {
    if (!address) return;

    try {
      setIsCheckingRegistration(true);
      const result = await PharmaChain.read.isUserRegistered([address]);
      console.log("checkRegistrationStatus:", result as boolean);
      setIsRegistered(result as boolean);
    } catch (error) {
      console.error("Error checking registration status:", error);
      setIsRegistered(false);
    } finally {
      setIsCheckingRegistration(false);
    }
  }, [address]);

  useEffect(() => {
    if (address) {
      checkRegistrationStatus();
    }
  }, [address, checkRegistrationStatus]);

  // Convert role string to enum value
  const roleEnumValue = (role: string): Role => {
    switch (role) {
      case "Manufacturer":
        return Role.Manufacturer;
      case "Distributor":
        return Role.Distributor;
      case "Provider":
        return Role.Provider;
      default:
        throw new Error(`Unknown role: ${role}`);
    }
  };

  const {
    sendUserOperation,
    sendUserOperationResult,
    isSendingUserOperation,
    error: isSendUserOperationError,
  } = useSendUserOperation({ client, waitForTxn: true });

  const registerUser = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const uoCallData = client
      ? encodeFunctionData({
          abi: ContractAbi,
          functionName: "registerUser",
          args: [address, companyName, roleEnumValue(role), email],
        })
      : null;
    if (!client || !uoCallData) {
      console.error("Client not initialized or uoCallData is null");
      return;
    }
    setIsLoading(true);
    try {
      const uo = sendUserOperation({
        uo: {
          target: ContractAddress,
          data: uoCallData,
        },
      });
      setIsRegistered(true);
    } catch (error) {
      console.error("Error registering user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingRegistration) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="font-bold">Address:</div>
            <div>{address}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="font-bold">Email:</div>
            <div>{user?.email}</div>
          </div>
        </div>
        <div className="my-2 flex flex-col gap-4"></div>
        <OpStatus
          sendUserOperationResult={sendUserOperationResult}
          isSendingUserOperation={isSendingUserOperation}
          isSendUserOperationError={isSendUserOperationError}
        />
      </form>
      {isRegistered === null ? (
        <></>
      ) : isRegistered ? (
        <></>
      ) : (
        <form className="flex flex-col gap-8" onSubmit={registerUser}>
          <div className="text-[18px] font-semibold">Register User</div>
          <div className="flex flex-col justify-between gap-6">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={onEmailChange}
            />
            <Input
              type="text"
              placeholder="Enter your company name"
              value={companyName}
              onChange={onCompanyNameChange}
            />
            <select value={role} onChange={onRoleChange}>
              <option value="">Select your role</option>
              <option value="Manufacturer">Manufacturer</option>
              <option value="Distributor">Distributor</option>
              <option value="Provider">Provider</option>
            </select>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : "Register"}
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
};
