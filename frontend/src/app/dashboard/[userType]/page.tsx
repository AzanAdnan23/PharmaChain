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

    switch (userType) {
        case "manufacturer":
            return <ManufacturerDashboard />;
        case "distributor":
            return <DistributorDashboard />;
        case "provider":
            return <ProviderDashboard />;
        default:
            return <h1>Route Not Found!</h1>;
    }
};

export default Dashboard;
