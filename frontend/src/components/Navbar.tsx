// components/Navbar.tsx
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button"; // Ensure Button is from shadcn/ui components
import { SunIcon, MoonIcon } from "lucide-react";
import { LogOut } from "@/components/logout";

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 shadow-md dark:bg-gray-800">
      <nav className="flex items-center">
        <Link
          href="/"
          className="text-lg font-semibold text-black dark:text-white"
        >
          PharmaChain
        </Link>
      </nav>
      <nav className="flex items-center">
        <Link href="/login" passHref>
          <Button className="mr-4 bg-black text-white dark:bg-gray-300 dark:text-black">
            Launch App
          </Button>
        </Link>
        <Button
          onClick={toggleTheme}
          className="bg-transparent text-black dark:text-white"
        >
          {theme === "light" ? (
            <SunIcon className="h-6 w-6" />
          ) : (
            <MoonIcon className="h-6 w-6" />
          )}
        </Button>
        <LogOut />
      </nav>
    </header>
  );
};

export default Navbar;
