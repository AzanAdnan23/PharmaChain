import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";

export const CreateBatchForm = () => {
  const [rfidUid, setRfidUid] = useState("");

  const scanRfidUid = () => {
    // Simulated RFID scanning logic
    const fakeRfidUid = "1234567890ABCDEF";
    setRfidUid(fakeRfidUid);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <Card>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="batchId" className="block text-sm font-medium text-gray-700 dark:text-white">
            Batch ID
          </label>
          <Input
            id="batchId"
            name="batchId"
            type="text"
            required
            className="mt-1 block w-full"
          />
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-white">
            Quantity
          </label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            required
            className="mt-1 block w-full"
          />
        </div>

        <div>
          <label htmlFor="medicineName" className="block text-sm font-medium text-gray-700 dark:text-white">
            Medicine Name
          </label>
          <Input
            id="medicineName"
            name="medicineName"
            type="text"
            required
            className="mt-1 block w-full"
          />
        </div>

        <div>
          <label htmlFor="rfidUid" className="block text-sm font-medium text-gray-700 dark:text-white">
            RFID UID
          </label>
          <div className="flex items-center space-x-2 mt-1">
            <Input
              id="rfidUid"
              name="rfidUid"
              type="text"
              value={rfidUid}
              readOnly
              className="flex-1"
            />
            <Button type="button" onClick={scanRfidUid} variant="secondary">
              Scan UID
            </Button>
          </div>
        </div>

        <div>
          <Button type="submit">Create</Button>
        </div>
      </form>
    </Card>
  );
};
