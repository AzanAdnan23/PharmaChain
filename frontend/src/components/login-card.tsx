"use client";

import { useAuthenticate, useSignerStatus } from "@alchemy/aa-alchemy/react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { getContract } from "viem";
import { useAccount, useUser } from "@alchemy/aa-alchemy/react";
import {
  chain,
  accountType,
  gasManagerConfig,
  accountClientOptions as opts,
  ContractAddress,
  ContractAbi,
  publicClient,
} from "@/config";

export const LogInCard = () => {
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCheckingRegistration, setIsCheckingRegistration] =
    useState<boolean>(false);
  const { authenticate } = useAuthenticate();
  const { status } = useSignerStatus();
  const isAwaitingEmail = status === "AWAITING_EMAIL_AUTH";

  const { address } = useAccount({ type: accountType });

  const PharmaChain = getContract({
    address: ContractAddress,
    abi: ContractAbi,
    client: publicClient,
  });

  const checkRegistrationStatus = useCallback(async () => {
    try {
      setIsCheckingRegistration(true);
      const result = await PharmaChain.read.isUserRegistered([address]);
      console.error(" checking registration status:", result as boolean);
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

  const login = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setIsLoading(true);
    try {
      // Assuming the contract method needs to be called here instead of using the address
      const addressToCheck = "0xF446609Bb1576E587969Eb2a88c0F7288C732856";
      const result = await PharmaChain.read.isUserRegistered([addressToCheck]);
      console.error(" checking registration status:", result as boolean);
      setIsRegistered(result as boolean);

      if (result) {
        authenticate({ type: "email", email });
      }
    } catch (error) {
      console.error("Error checking registration status:", error);
      setIsRegistered(false);
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setIsLoading(true);
    try {
      await PharmaChain.write.registerUser([address, companyName, role, email]);
      setIsRegistered(true);
      authenticate({ type: "email", email });
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
      {isRegistered === null || isRegistered ? (
        isAwaitingEmail ? (
          <div className="text-[18px] font-semibold">Check your email!</div>
        ) : (
          <form className="flex flex-col gap-8" onSubmit={login}>
            <div className="text-[18px] font-semibold">
              Log in to PharmaChain
            </div>
            <div className="flex flex-col justify-between gap-6">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={onEmailChange}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Loading..." : "Log in"}
              </Button>
            </div>
          </form>
        )
      ) : (
        <form className="flex flex-col gap-8" onSubmit={registerUser}>
          <div className="text-[18px] font-semibold">Register User</div>
          <div className="flex flex-col justify-between gap-6">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={onEmailChange}
              readOnly
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
