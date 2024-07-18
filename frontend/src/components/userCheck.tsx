// COMPONENT TO CHECK IS USER REGISTERED OR NOT

/// WORK IN PROGRESS
// SPENT FUCKING 12 HOURS ON THIS SHIT

import React, { useState } from "react";
import { getContract } from "viem";
import {
  useAccount,
  useLogout,
  useSendUserOperation,
  useSmartAccountClient,
  useUser,
} from "@alchemy/aa-alchemy/react";

import {
  chain,
  accountType,
  gasManagerConfig,
  accountClientOptions as opts,
  ContractAddress,
  ContractAbi,
  publicClient,
} from "@/config";
import { Card } from "@radix-ui/themes";

export const UserCheck = () => {
  const user = useUser();
  const { address } = useAccount({ type: accountType });

  const PharmaChain = getContract({
    address: ContractAddress,
    abi: ContractAbi,
    client: publicClient,
  });

  if (address) {
    const isRegistered = PharmaChain.read.isUserRegistered([address]);
    console.log(isRegistered);
  } else {
    console.error("Address is undefined");
  }

  return (
    <Card>
      <h1>Check if user is registered</h1>
      <p>Address: {address}</p>
      <p>Is Registered: </p>
    </Card>
  );
};
