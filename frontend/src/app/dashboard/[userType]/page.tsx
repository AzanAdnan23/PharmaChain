// contents of app/dashboard/[userType]/page.tsx
"use client";

import { useParams } from "next/navigation";

// import dashboard components
import ManufacturerDashboard from "@/components/dashboards/ManufacturerDashboard";
import DistributorDashboard from "@/components/dashboards/DistributorDashboard";
import ProviderDashboard from "@/components/dashboards/ProviderDashboard";

const Dashboard = () => {
  const params = useParams();
  const userType = params.userType;
  return (
    <main>
      {userType === "manufacturer" && <ManufacturerDashboard />}
      {userType === "distributor" && <DistributorDashboard />}
      {userType === "provider" && <ProviderDashboard />}
    </main>
  );
};

export default Dashboard;
