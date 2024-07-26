"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LogInCard } from "@/components/login-card";
import { UserCheck } from "@/components/user-check";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import ThemeSwitch from "@/components/ui/theme-switch";
import { useSignerStatus } from "@alchemy/aa-alchemy/react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Login() {
  const { isInitializing, isAuthenticating, isConnected, status } =
    useSignerStatus();
  const isLoading =
    isInitializing || (isAuthenticating && status !== "AWAITING_EMAIL_AUTH");

  const [userRole, setUserRole] = useState<string | null>(null);

  const handleUserRole = (role: string) => {
    setUserRole(role);
  };

  const getRoleString = (role: string | number) => {
    switch (role.toString()) {
      case "0":
        return "manufacturer";
      case "1":
        return "distributor";
      case "2":
        return "provider";
      default:
        return "Unknown Role";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <h1 className="text-2xl font-semibold">Login</h1>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex justify-center">
                <LoadingSpinner />
              </div>
            ) : isConnected ? (
              <UserCheck onUserRoleCheck={handleUserRole} />
            ) : (
              <LogInCard />
            )}
            {userRole != null && (
              <div className="mt-4 text-center">
                <Link href={`/dashboard/${getRoleString(userRole)}`}>
                  <Button className="w-full">Go to Dashboard</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
        <div className="mt-4 text-center">
          <ThemeSwitch />
        </div>
      </div>
    </div>
  );
}
