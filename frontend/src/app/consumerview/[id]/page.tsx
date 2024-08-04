"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Timeline from "@/components/consumer/Timeline";
import MedicineInfo from "@/components/consumer/MedicineInfo";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose,
    DrawerTrigger,
} from "@/components/ui/drawer";

interface Step {
    location: string;
    date: string;
    status: "completed" | "current" | ""; // Define the possible statuses
}

const ConsumerView = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const steps: Step[] = [
        { location: "Order Placed", date: "2024-08-01 10:00 AM", status: "completed" },
        { location: "Shipped", date: "2024-08-02 02:00 PM", status: "completed" },
        { location: "In Transit", date: "2024-08-03 11:00 AM", status: "current" },
        { location: "Out for Delivery", date: "2024-08-04 09:00 AM", status: "" },
    ];

    const params = useParams();
    const id = params.id;

    const handleOpenDrawer = () => setIsDrawerOpen(true);

    return (
        <div className="p-4 pr-5">
            <MedicineInfo
                name="Panadol Tablets 500MG"
                expiryDate="2025-12-31"
                batchId="AB123456"
                scanStatus="new_scan" // or "already_scanned", depending on your logic
            />
            <Timeline steps={steps} />

            <Drawer>
                <DrawerTrigger asChild>
                    <div className="flex justify-center p-10">
                        <Button className="rounded-3xl w-full text-md p-6" onClick={handleOpenDrawer}>
                            Verify Authenticity
                        </Button>
                    </div>
                </DrawerTrigger>
                <DrawerContent>
                    <div className="">
                        <DrawerHeader>
                            <DrawerTitle className="text-2xl text-center">Verification Status</DrawerTitle>
                        </DrawerHeader>
                        <div className="p-4">
                            <div className="text-center text-md text-green-700">
                                Medicine is authentic
                            </div>
                        </div>
                        <DrawerFooter>
                            <DrawerClose asChild>
                                <Button className="rounded-3xl text-md">Close</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
};

export default ConsumerView;
