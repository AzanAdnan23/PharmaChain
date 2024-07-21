import React, { useState, useEffect } from "react";
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

export const UserCheck: React.FC = () => {
  const [isUserRegistered, setIsUserRegistered] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const user = useUser();
  const { address } = useAccount({ type: accountType });

  useEffect(() => {
    const checkRegistration = async () => {
      if (user?.address) {
        try {
          const PharmaChain = getContract({
            address: ContractAddress,
            abi: ContractAbi,
            client: publicClient,
          });

          // Type assertion to cast the return value to boolean
          const isRegistered = (await PharmaChain.read.isUserRegistered([
            address,
          ])) as boolean;
          setIsUserRegistered(isRegistered);
        } catch (error) {
          console.error("Error checking user registration:", error);
        }
      }
      setLoading(false);
    };

    checkRegistration();
  }, [user?.address, address]);

  if (loading) {
    return (
      <Card>
        <p>Loading...</p>
      </Card>
    );
  }

  return (
    <Card>
      {user?.address ? (
        <p>User is {isUserRegistered ? "registered" : "not registered"}</p>
      ) : (
        <p>No user address found</p>
      )}
    </Card>
  );
};
