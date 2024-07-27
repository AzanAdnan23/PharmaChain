// components/Navbar.tsx
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button"; // Ensure Button is from shadcn/ui components
import { SunIcon, MoonIcon } from "lucide-react";

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
    <header className="flex items-center justify-between h-16 px-4 border-b bg-white dark:bg-gray-800 shadow-md">
      <nav className="flex items-center">
        <Link href="/" className="text-lg font-semibold text-black dark:text-white">
          PharmaChain
        </Link>
      </nav>
      <nav className="flex items-center">
        <Link href="/login" passHref>
          <Button className="bg-black text-white dark:bg-gray-300 dark:text-black mr-4">
            Launch App
          </Button>
        </Link>
        <Button onClick={toggleTheme} className="bg-transparent text-black dark:text-white">
          {theme === "light" ? (
            <SunIcon className="w-6 h-6" />
          ) : (
            <MoonIcon className="w-6 h-6" />
          )}
        </Button>
      </nav>
    </header>
  );
};

export default Navbar;
