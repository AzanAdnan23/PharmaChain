import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { LogOut } from "@/components/logout";
import { useAccount } from "@alchemy/aa-alchemy/react";
import { CldImage } from "next-cloudinary";
import { accountType } from "@/config";
import { Switch } from "./ui/switch"; // Import Switch component from ./ui/switch
import { Card } from "./ui/card"; // Import Card component from ./ui/card
import { MoonIcon } from "lucide-react"; // Import MoonIcon for the theme switch
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"; // Import Popover components

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const [pfpURL, setPfpURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme, setTheme } = useTheme();
  const { address } = useAccount({ type: accountType });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchPfp = async () => {
      if (address) {
        setLoading(true);
        try {
          const response = await fetch("/api/get-pfp", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ address }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch pfpURL");
          }

          const data = await response.json();
          setPfpURL(data.pfpURL);
        } catch (error) {
          console.error("Error fetching pfpURL:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchPfp();
  }, [address]);

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  if (!mounted) {
    return null;
  }

  return (
    <header className="top-0 flex h-20 items-center justify-between border-b bg-white px-4 shadow-md dark:bg-gray-800">
      <nav className="flex items-center">
        <Link href="/" className="text-2xl font-semibold text-black dark:text-white">
          PharmaChain
        </Link>
      </nav>
      <nav className="flex items-center">
        {!address && (
          <Link href="/login" passHref>
            <Button className="mr-4 bg-black text-white dark:bg-gray-300 dark:text-black">
              Launch App
            </Button>
          </Link>
        )}
        {address && (
          <div className="relative">
            <Popover>
              <PopoverTrigger asChild>
                <CldImage
                  width="40"
                  height="40"
                  src={pfpURL || '/default-avatar.png'}
                  sizes="100vw"
                  alt="Profile Picture"
                  className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 cursor-pointer"
                />
              </PopoverTrigger>
              <PopoverContent className="mr-2 mt-4 w-64 p-4 bg-white dark:bg-gray-900 shadow-lg border border-gray-300 dark:border-gray-700">
                <div className="flex flex-col items-center space-y-4">
                  <CldImage
                    width="80"
                    height="80"
                    src={pfpURL || '/default-avatar.png'}
                    sizes="100vw"
                    alt="Profile Picture"
                    className="w-20 h-20 rounded-full mx-auto mb-4"
                  />
                  <div className="flex items-center space-x-2 mb-2">
                    <MoonIcon className="h-6 w-6 text-gray-500 dark:text-gray-300" />
                    <Switch
                      checked={theme === "dark"}
                      onCheckedChange={handleThemeChange}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <LogOut />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
