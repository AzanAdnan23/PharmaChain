import React from "react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import from next/navigation
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
import { LoadingSpinner } from "./ui/loading-spinner";
import { CldUploadWidget } from "next-cloudinary";
import { Toaster, toast } from "sonner";

enum Role {
  Manufacturer = 0,
  Distributor = 1,
  Provider = 2,
}

interface UserCheckProps {
  onUserRoleCheck: (role: string) => void;
}

export const UserCheck: React.FC<UserCheckProps> = ({ onUserRoleCheck }) => {
  const [pfpURL, setpfpURL] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCheckingRegistration, setIsCheckingRegistration] =
    useState<boolean>(false);

  const user = useUser();
  const { address } = useAccount({ type: accountType });
  const router = useRouter(); // Use useRouter from next/navigation

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

      if (result) {
        checkUserRole();
      }
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

  useEffect(() => {
    if (user && user.email) {
      setEmail(user.email);
    }
  }, [user]);

  const checkUserRole = useCallback(async () => {
    try {
      const result = await PharmaChain.read.getUserRole([address]);
      console.log("check User Role:", result as string);
      onUserRoleCheck(result as string); // Pass the role to the parent component
    } catch (error) {
      console.error("Error checking role:", error);
      setIsRegistered(false);
    }
  }, [address, onUserRoleCheck]);

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

  const handlePfpSuccess = (result: any, widget: any) => {
    setpfpURL(result?.info?.public_id);
    toast.success("Profile picture uploaded successfully");
    widget.close();
  }

  const handlePfpError = (error: any, widget: any) => {
    toast.error("Error uploading profile picture");
    widget.close();
  }


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
      await sendUserOperation({
        uo: {
          target: ContractAddress,
          data: uoCallData,
        },
      });

      // Send address and pfpURL to the API route
      const res = await fetch("/api/register-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          pfpURL,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save user data to the database");
      }

      setIsRegistered(true);
      router.push(`/dashboard/${role.toLowerCase()}`); // Redirect after successful registration
    } catch (error) {
      console.error("Error registering user:", error);
    } finally {
      setIsLoading(false);
    }
  };


  if (isCheckingRegistration || isRegistered === null || isRegistered) {
    return <LoadingSpinner />;
  }

  return (
    <Card className="p-6 max-w-md mx-auto shadow-lg">
      <form className="flex flex-col gap-6" onSubmit={registerUser}>
        <div className="text-center text-[20px] font-bold text-gray-800 mb-4">
          Register User
        </div>
        <div className="flex flex-col gap-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={onEmailChange}
            readOnly
            className="p-3 border border-gray-300 rounded-md"
          />
          <Input
            type="text"
            placeholder="Enter your company name"
            value={companyName}
            onChange={onCompanyNameChange}
            className="p-3 border border-gray-300 rounded-md"
          />
          <select
            value={role}
            onChange={onRoleChange}
            className="p-3 border border-gray-300 rounded-md"
          >
            <option value="">Select your role</option>
            <option value="Manufacturer">Manufacturer</option>
            <option value="Distributor">Distributor</option>
            <option value="Provider">Provider</option>
          </select>
          <CldUploadWidget
            uploadPreset="djfushlk"
            options={{ sources: ["local", "url"], multiple: false }}
            onError={handlePfpError}
            onSuccess={handlePfpSuccess}
          >
            {({ open }) => {
              return (
                <Button
                  className="mt-4"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => open()}
                  type="button"
                >
                  Upload Profile Picture
                </Button>
              );
            }}
          </CldUploadWidget>
          <Button
            type="submit"
            disabled={isLoading}
            className="mt-4"
          >
            {isLoading ? "Loading..." : "Register"}
          </Button>
        </div>
      </form>
      <Toaster />
    </Card>
  );
};
