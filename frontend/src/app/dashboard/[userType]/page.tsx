// contents of app/dashboard/[userType]/page.tsx
"use client";

import { useParams } from "next/navigation";

// import dashboard components
import ManufacturerDashboard from "@/components/dashboards/ManufacturerDashboard";
import DistributorDashboard from "@/components/dashboards/DistributorDashboard";
import ProviderDashboard from "@/components/dashboards/ProviderDashboard";
import Navbar from "@/components/Navbar";

const Dashboard = () => {
  const RFID = "0x05416460deb76d57af601be17e777b93592d8d4d4a4096c57876a91c84f4a711";
  const params = useParams();
  const userType = params.userType;
  return (
    <main className="bg-muted/40 min-h-screen flex flex-col">
      <Navbar />
      {userType === "manufacturer" && <ManufacturerDashboard tempRFID={RFID} />}
      {userType === "distributor" && <DistributorDashboard tempRFID={RFID} />}
      {userType === "provider" && <ProviderDashboard tempRFID={RFID} />}
    </main>
  );
};

export default Dashboard;
