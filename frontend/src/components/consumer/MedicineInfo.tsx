import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MedicineInfoProps {
  name: string;
  expiryDate: string;
  batchId: string;
  scanStatus: "already_scanned" | "new_scan";
}

const MedicineInfo: React.FC<MedicineInfoProps> = ({
  name,
  expiryDate,
  batchId,
  scanStatus,
}) => {
  return (
    <Card className="mt-4 mb-8 w-full p-3">
      <CardHeader>
        <CardTitle className="text-4xl">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mt-5">
          <div className="text-sm">
            <span className="font-semibold mr-3">Expiry Date:</span>
            <span className="text-gray-500">{expiryDate}</span>
          </div>
          <div className="text-sm">
            <span className="font-semibold mr-3">Batch ID:</span>
            <span className="text-gray-500">{batchId}</span>
          </div>
          <div className="text-sm">
            <span className="font-semibold mr-3">Status:</span>
            <Badge>
          {scanStatus === "already_scanned" ? "Already Scanned" : "New Scan"}
        </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicineInfo;