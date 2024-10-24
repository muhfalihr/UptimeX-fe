import React from 'react';
import StatusesCard from '../StatusCard/StatusesCard';
import ServerInfoChart from '../ServersInfoChart/ServersInfoChart';

export default function DashboardPage({ serverData }) {
    return (
        <div className="min-h-screen text-gray-300 font-sans">
            <div className="ml-16 p-6">
                <StatusesCard serverData={serverData}/>
                <ServerInfoChart serverData={serverData}/>
            </div>
        </div>
    );
}
