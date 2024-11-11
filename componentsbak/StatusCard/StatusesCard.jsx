import React from "react";
import StatusCard from "./StatusCard";
import { useServerData } from '../../contextbak/ServerContext';

export default function StatusesCard() {
    const { serverData, historicalData } = useServerData();
    const { activeServers, timeoutServers, unaccessibleServers, timestamps } = historicalData;
    
    const statusCounts = {
        active: serverData.server_status_list.filter(server => server.status === "active").length,
        timeout: serverData.server_status_list.filter(server => server.status === "timeout").length,
        inaccessible: serverData.server_status_list.filter(server => server.status === "unaccessible").length,
        total: serverData.server_status_list.length
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
            <StatusCard
                title="Active Servers"
                count={statusCounts.active}
                percentage={(statusCounts.active / statusCounts.total * 100).toFixed(1)}
                trend={activeServers}
                timestamps={timestamps}
                status="active"
                color="bg-green-500"
            />
            
            <StatusCard
                title="Timeout Servers"
                count={statusCounts.timeout}
                percentage={(statusCounts.timeout / statusCounts.total * 100).toFixed(1)}
                trend={timeoutServers}
                timestamps={timestamps}
                status="timeout"
                color="bg-yellow-500"
            />
            
            <StatusCard
                title="Inaccess Servers"
                count={statusCounts.inaccessible}
                percentage={(statusCounts.inaccessible / statusCounts.total * 100).toFixed(1)}
                trend={unaccessibleServers}
                timestamps={timestamps}
                status="unaccessible"
                color="bg-red-500"
            />
            
            <StatusCard
                title="Total Servers"
                count={statusCounts.total}
                percentage="100"
                trend={[...Array(timestamps.length)].map(() => statusCounts.total)}
                timestamps={timestamps}
                status="total"
                color="bg-blue-500"
            />
        </div>
    );
}