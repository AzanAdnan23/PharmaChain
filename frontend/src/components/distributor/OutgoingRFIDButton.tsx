import { Button } from "@/components/ui/button";

export default function OutgoingRFIDButton() {
  const handleScan = () => {
    // Handle outgoing RFID scan
  };

  return (
    <Button onClick={handleScan} className="w-full mt-4">Scan Outgoing RFID</Button>
  );
}
