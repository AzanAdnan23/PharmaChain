"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Timeline from "@/components/consumer/Timeline";
import MedicineInfo from "@/components/consumer/MedicineInfo";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner"; 
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerFooter,
    DrawerClose,
    DrawerTrigger,
} from "@/components/ui/drawer";

const ConsumerView = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [medicineData, setMedicineData] = useState<MedicineData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const params = useParams();
    const id = params.id;

    useEffect(() => {
        const fetchMedicineData = async () => {
            try {
                const response = await fetch(`/api/batches/${id}`);
                if (!response.ok) {
                    throw new Error("Medicine not found or error fetching data");
                }
                const data = await response.json();
                
                if (!data || !data.medicine) {
                    throw new Error("Invalid data structure from API");
                }

                // Only update QR scanned status if it is false
                if (!data.medicine.events.qrScanned) {
                    console.log("entering patch block");
                    const updateResponse = await fetch(`/api/batches/${id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ qrScanned: true }),
                    });
                    if (!updateResponse.ok) {
                        throw new Error("Failed to update QR scanned status");
                    }
                }
    
                setMedicineData(data.medicine);
            } catch (error: any) {
                console.error("Failed to fetch medicine data", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
    
        if (id) {
            fetchMedicineData();
        }
    }, [id]);

    const handleOpenDrawer = () => setIsDrawerOpen(true);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) return <div>Error: {error}</div>;
    if (!medicineData) return <div>No data found</div>;

    const formatDate = (date: Date | null) => {
        if (!date) return "";
        return date.toString(); // Keeping original format for event dates
    };

    const formatExpiryDate = (date: string) => {
        return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }).format(new Date(date));
    };

    const shortenBatchId = (batchId: string) => {
        if (batchId.length <= 10) return batchId;
        return `${batchId.slice(0, 5)}...${batchId.slice(-5)}`;
    };

    const steps: Step[] = [
        { location: "Batch Created", date: formatDate(medicineData.timestamps.batchCreatedAt), status: medicineData.events.batchCreated ? "completed" : "" },
        { location: "Batch Approved", date: formatDate(medicineData.timestamps.batchApprovedAt), status: medicineData.events.batchApproved ? "completed" : "" },
        { location: "Batch Disapproved", date: formatDate(medicineData.timestamps.batchDisapprovedAt), status: medicineData.events.batchDisapproved ? "completed" : "" },
        { location: "Batch Recalled", date: formatDate(medicineData.timestamps.batchRecalledAt), status: medicineData.events.batchRecalled ? "completed" : "" },
        { location: "Dispatched to Distributor", date: formatDate(medicineData.timestamps.manufacturerOutgoingRFIDAt), status: medicineData.events.manufacturerOutgoingRFID ? "completed" : "" },
        { location: "Arrived at Distributor", date: formatDate(medicineData.timestamps.distributorIncomingRFIDAt), status: medicineData.events.distributorIncomingRFID ? "completed" : "" },
        { location: "Dispatched to Provider", date: formatDate(medicineData.timestamps.distributorOutgoingRFIDAt), status: medicineData.events.distributorOutgoingRFID ? "completed" : "" },
        { location: "Arrived at Provider", date: formatDate(medicineData.timestamps.providerIncomingRFIDAt), status: medicineData.events.providerIncomingRFID ? "completed" : "" },
        { location: "QR Scanned", date: formatDate(medicineData.timestamps.qrScannedAt), status: medicineData.events.qrScanned ? "completed" : "" },
    ].filter(step => step.date);

    // Authenticity logic updated to consider the providerIncomingRFID event
    const isAuthentic = !medicineData.events.batchRecalled &&
                        !medicineData.events.batchDisapproved &&
                        medicineData.events.providerIncomingRFID;
                        
    const qrScanStatusMessage = medicineData.events.qrScanned ? "QR code has already been scanned." : "";

    return (
        <main className="flex flex-col min-h-screen p-4 pr-5 bg-muted/40">
            <div className="flex-grow">
                <MedicineInfo
                    name={medicineData.medicineName}
                    expiryDate={formatExpiryDate(medicineData.expiryDate)}
                    batchId={shortenBatchId(medicineData.batchId)}
                    scanStatus={medicineData.events.qrScanned ? "already_scanned" : "new_scan"}
                />
                <Timeline steps={steps} />
            </div>
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
                            {!qrScanStatusMessage && isAuthentic && (
                                <div className="text-center text-md text-green-700">
                                    Medicine is authentic
                                </div>
                            )}
                            {!isAuthentic && (
                                <div className="text-center text-md text-red-700">
                                    Medicine is not authentic
                                </div>
                            )}
                            {qrScanStatusMessage && <div className="text-center text-md text-red-700">{qrScanStatusMessage}</div>}
                        </div>
                        <DrawerFooter>
                            <DrawerClose asChild>
                                <Button className="rounded-3xl text-md">Close</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        </main>
    );
};

export default ConsumerView;
