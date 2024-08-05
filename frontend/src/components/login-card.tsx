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
    <Card className="p-8 shadow-lg rounded-lg max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold">
          {isAwaitingEmail ? "Check your email!" : "Login to PharmaChain"}
        </h2>
      </div>
      {isAwaitingEmail ? (
        <div className="text-center">
          Check your email to complete the login process.
        </div>
      ) : (
        <form className="flex flex-col gap-6" onSubmit={login}>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={onEmailChange}
            className="mb-2"
          />
          <Button
            type="submit"
            className="mb-4"
          >
            Log in
          </Button>
        </form>
      )}
    </Card>
  );
};
