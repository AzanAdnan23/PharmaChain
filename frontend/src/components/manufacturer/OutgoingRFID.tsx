import { Button } from "@/components/ui/button";

export default function OutgoingRFID() {
  const handleScan = () => {
    // Handle outgoing RFID scan
  };

  return (
    <Button onClick={handleScan} className="mt-4">Scan Outgoing RFID</Button>
  );
}
