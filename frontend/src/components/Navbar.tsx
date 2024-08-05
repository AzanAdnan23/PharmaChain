"use client";

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
    <header className="flex h-20 items-center justify-between border-b px-4 bg-background">
      <nav className="flex items-center">
        <Link href="/" className="text-xl font-semibold">
          PharmaChain
        </Link>
      </nav>
      <nav className="flex items-center">
        {!address && (
          <Link href="/login" passHref>
            <Button className="mr-6">
              Launch App
            </Button>
          </Link>
        )}
        {address && (
          <div className="relative">
            <Popover>
              <PopoverTrigger asChild>
                <CldImage
                  width="100"
                  height="100"
                  src={pfpURL || '/default-avatar.png'}
                  sizes="100vw"
                  alt="Profile Picture"
                  className="w-10 h-10 rounded-full cursor-pointer"
                />
              </PopoverTrigger>
              <PopoverContent className="mr-2 mt-5 p-10">
                <div className="flex flex-col items-center space-y-6">
                  <CldImage
                    width="100"
                    height="100"
                    src={pfpURL || '/default-avatar.png'}
                    sizes="100vw"
                    alt="Profile Picture"
                    className="w-30 h-30 rounded-full mx-auto"
                  />
                  <div className="flex items-center space-x-2">
                    <MoonIcon className="h-6 w-6" />
                    <Switch
                      checked={theme === "dark"}
                      onCheckedChange={handleThemeChange}
                    />
                  </div>
                  <LogOut />
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
