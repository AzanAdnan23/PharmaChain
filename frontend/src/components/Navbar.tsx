// components/Navbar.tsx
import Link from "next/link";
import { Button } from "./ui/button"; // Ensure Button is from shadcn/ui components

const Navbar = () => {
  return (
    <header className="flex items-center justify-between h-16 px-4 border-b bg-white shadow-md">
      <nav className="flex items-center">
        <Link href="/" className="text-lg font-semibold">
          PharmaChain
        </Link>
      </nav>
      <nav className="flex items-center">
        <Link href="/login" passHref>
          <Button className="bg-black text-white">Login</Button>
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
