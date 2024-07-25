"use client";

import { LogInCard } from "@/components/login-card";
import { UserCheck } from "@/components/user-check";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import ThemeSwitch from "@/components/ui/theme-switch";
import { useSignerStatus } from "@alchemy/aa-alchemy/react";
import React, { useState } from "react";

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
        return "Manufacturer";
      case "1":
        return "Distributor";
      case "2":
        return "Provider";
      default:
        return "Unknown Role";
    }
  };

  return (
    <div>
      {isLoading ? (
        <LoadingSpinner />
      ) : isConnected ? (
        <UserCheck onUserRoleCheck={handleUserRole} />
      ) : (
        <LogInCard />
      )}
      {userRole && <div>User Role: {getRoleString(userRole)}</div>}
    </div>
  );
}
