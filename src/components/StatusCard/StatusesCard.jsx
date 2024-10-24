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
        <div className="h-[8rem] grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StatusCard title="active servers" count={statusCounts.active} color="bg-green-500" />
            <StatusCard title="timeout servers" count={statusCounts.timeout} color="bg-yellow-500" />
            <StatusCard title="inaccessible servers" count={statusCounts.inaccessible} color="bg-red-500" />
            <StatusCard title="total servers" count={statusCounts.total} color="" />
        </div>
    );
}