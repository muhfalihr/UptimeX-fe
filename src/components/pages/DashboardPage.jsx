import React from 'react';
import { Layout, Activity } from 'lucide-react';
import StatusesCard from '../StatusCard/StatusesCard';
import ServerInfoChart from '../ServersInfoChart/ServersInfoChart';

// Enhanced Card Component to maintain consistency
const Card = ({ children, className = "", title, icon: Icon }) => (
    <div className={`bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 
                     transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 
                     hover:border-blue-500/30 ${className}`}>
        {title && (
            <div className="flex items-center gap-2 mb-4">
                {Icon && <Icon className="w-5 h-5 text-blue-400" />}
                <h4 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-400 
                              bg-clip-text text-transparent">
                    {title}
                </h4>
            </div>
        )}
        {children}
    </div>
);
export default function DashboardPage({ serverData }) {
    return (
        <div className="max-w-full min-h-screen bg-gray-900 text-gray-100 overflow-hidden">
            <div className="ml-4 sm:ml-16 p-6 max-w-screen-lg mx-auto">
                {/* Enhanced Header */}
                <div className="mb-8 bg-gray-800/40 p-4 rounded-xl border border-gray-700/50">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 
                                 bg-clip-text text-transparent flex items-center gap-2">
                        <Layout className="w-6 h-6" />
                        Dashboard Overview
                    </h2>
                    <p className="text-gray-400 mt-1">
                        Last Updated: {new Date(serverData.timestamp).toLocaleString()}
                    </p>
                </div>

                <div className="space-y-6">
                    <Card title="Server Statuses" icon={Activity}>
                        <StatusesCard serverData={serverData} />
                    </Card>

                    <Card title="Server Metrics" icon={Activity}>
                        <ServerInfoChart serverData={serverData} />
                    </Card>
                </div>

                <div className="text-sm text-gray-400 flex items-center gap-2 mt-6">
                    <Activity className="w-4 h-4" />
                    Data refreshes automatically every 30 seconds
                </div>
            </div>
        </div>
    );
}
