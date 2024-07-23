// contents of app/dashboard/[userType]/page.tsx
"use client";

import { useParams } from "next/navigation";

// import dashboard components
import ManufacturerDashboard from "@/components/ManufacturerDashboard";
import DistributorDashboard from "@/components/DistributorDashboard";
import RetailerDashboard from "@/components/RetailerDashboard";

const Dashboard = () => {
    const params = useParams();
    const userType = params.userType;

    switch (userType) {
        case "manufacturer":
            return <ManufacturerDashboard />;
        case "distributor":
            return <DistributorDashboard />;
        case "retailer":
            return <RetailerDashboard />;
        default:
            return <h1>Route Not Found!</h1>;
    }
};

export default Dashboard;
