"use client";

import { useAuthenticate, useSignerStatus } from "@alchemy/aa-alchemy/react";
import { FormEvent, useCallback, useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";

export const LogInCard = () => {
  const [email, setEmail] = useState<string>("");
  const onEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
    []
  );

  const { authenticate } = useAuthenticate();
  const login = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    authenticate({ type: "email", email });
  };

  const { status } = useSignerStatus();
  const isAwaitingEmail = status === "AWAITING_EMAIL_AUTH";

  return (
    <Card className="p-8 shadow-lg rounded-lg max-w-md mx-auto bg-white dark:bg-gray-800">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          {isAwaitingEmail ? "Check your email!" : "Log in to the Embedded Accounts Demo!"}
        </h2>
      </div>
      {isAwaitingEmail ? (
        <div className="text-center text-gray-600 dark:text-gray-400">
          Check your email to complete the login process.
        </div>
      ) : (
        <form className="flex flex-col gap-6" onSubmit={login}>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={onEmailChange}
            className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
          />
          <Button
            type="submit"
            className="mt-4 w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Log in
          </Button>
        </form>
      )}
    </Card>
  );
};
