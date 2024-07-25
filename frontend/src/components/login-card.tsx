import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { getContract } from "viem";
import { accountType, ContractAddress, ContractAbi, publicClient } from "@/config";
import Link from "next/link";
import { useAuthenticate, useSignerStatus, useAccount } from "@alchemy/aa-alchemy/react";
import { FormEvent, useCallback, useEffect, useState } from "react";

export const LogInCard = () => {
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCheckingRegistration, setIsCheckingRegistration] = useState<boolean>(false);
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

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const onRoleChange = (value: string) => setRole(value);
  const onCompanyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setCompanyName(e.target.value);

  const login = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setIsLoading(true);
    try {
      const result = await PharmaChain.read.isUserRegistered([address]);
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">
            {isRegistered === null || isRegistered ? (isAwaitingEmail ? "Check your email!" : "Log in to PharmaChain") : "Register User"}
          </CardTitle>
          <CardDescription>
            {isRegistered === null || isRegistered ? (isAwaitingEmail ? "Please check your email to complete the login process." : "Enter your email below to log in.") : "Complete the form to register as a new user."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isRegistered === null || isRegistered ? (
            isAwaitingEmail ? (
              <div className="text-[18px] font-semibold">Check your email!</div>
            ) : (
              <form className="flex flex-col gap-8" onSubmit={login}>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={onEmailChange} required />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Loading..." : "Log in"}
                </Button>
              </form>
            )
          ) : (
            <form className="flex flex-col gap-8" onSubmit={registerUser}>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={onEmailChange} readOnly />
              <Label htmlFor="company-name">Company Name</Label>
              <Input id="company-name" type="text" placeholder="Enter your company name" value={companyName} onChange={onCompanyNameChange} />
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={onRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manufacturer">Manufacturer</SelectItem>
                  <SelectItem value="Distributor">Distributor</SelectItem>
                  <SelectItem value="Provider">Provider</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Loading..." : "Register"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter>
          {/* <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="#" className="underline underline-offset-2" prefetch={false}>
              Sign up
            </Link>
          </div> */}
        </CardFooter>
      </Card>
    </div>
  );
};
