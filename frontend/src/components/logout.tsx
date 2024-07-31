import { useLogout, useUser } from "@alchemy/aa-alchemy/react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter

export const LogOut = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const user = useUser();
  const { logout } = useLogout();
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    if (user?.address) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [user]);

  const handleLogout = async () => {
    await logout(); // Wait for logout to complete
    router.push("/"); // Redirect to home page after logout
  };

  return (
    <>
      {isLoggedIn && (
        <div>
          <Button type="button" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      )}
    </>
  );
};
