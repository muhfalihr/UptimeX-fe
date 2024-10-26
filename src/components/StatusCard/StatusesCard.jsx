import React from "react";
import StatusCard from "./StatusCard";

export default function StatusesCard({ serverData }) {
    const statusCounts = {
        active: serverData.server_status_list.filter(server => server.status === "active").length,
        timeout: serverData.server_status_list.filter(server => server.status === "timeout").length,
        inaccessible: serverData.server_status_list.filter(server => server.status === "unaccessible").length,
        total: serverData.server_status_list.length
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatusCard 
                title="Active Servers" 
                count={statusCounts.active} 
                color="bg-green-500" 
            />
            <StatusCard 
                title="Timeout Servers" 
                count={statusCounts.timeout} 
                color="bg-yellow-500" 
            />
            <StatusCard 
                title="Inaccessible Servers" 
                count={statusCounts.inaccessible} 
                color="bg-red-500" 
            />
            <StatusCard 
                title="Total Servers" 
                count={statusCounts.total} 
                color="bg-blue-500" 
            />
        </div>
    );
}
