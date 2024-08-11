import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast, Toaster } from 'sonner';

export default function OutgoingRFID() {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingRFID, setLoadingRFID] = useState<boolean>(false);
  const [rfidUID, setRfidUID] = useState<string | null>(null);

  const scanRfid = async () => {
    setLoadingRFID(true); // Start loading
    try {
      const response = await fetch('/api/scan-rfid');
      const text = await response.text();
      setRfidUID(text);
      toast.success('RFID scanned successfully');
    } catch (error) {
      console.error('Error scanning RFID:', error);
    } finally {
      setLoadingRFID(false); // End loading
    }
  };

  const handleScan = () => {
    // Handle outgoing RFID scan
  };

  return (
    <>
      <Button onClick={handleScan} className="mt-4">Scan Outgoing RFID</Button>
      <Toaster />
    </>
  );
}
