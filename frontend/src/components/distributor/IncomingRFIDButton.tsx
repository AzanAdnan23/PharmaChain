import { Button } from "@/components/ui/button";

export default function IncomingRFIDButton() {
  const handleScan = () => {
    // Handle incoming RFID scan
  };

  return (
    <Button onClick={handleScan} className="w-full mt-4">Scan Incoming RFID</Button>
  );
}
