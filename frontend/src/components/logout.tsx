import { useLogout } from "@alchemy/aa-alchemy/react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { LogOutIcon } from "lucide-react";

export const LogOut = () => {
  const { logout } = useLogout();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <Button type="button" onClick={handleLogout}>
      <LogOutIcon className="mr-2"/>
      Log Out
    </Button>
  );
};
