import { useLogout, useUser } from "@alchemy/aa-alchemy/react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";

export const LogOut = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const user = useUser();
  const { logout } = useLogout();

  useEffect(() => {
    if (user?.address) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [user]);

  return (
    <>
      {isLoggedIn && (
        <div>
          <Button type="button" onClick={() => logout()}>
            Logout
          </Button>
        </div>
      )}
    </>
  );
};
