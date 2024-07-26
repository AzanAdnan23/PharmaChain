import { useLogout, useUser } from "@alchemy/aa-alchemy/react";
import { Button } from "./ui/button";
export const ProfileCard = () => {
  const user = useUser();
  const { logout } = useLogout();

  return (
    <div>
      <Button type="button" onClick={() => logout()}>
        Logout
      </Button>
    </div>
  );
};
