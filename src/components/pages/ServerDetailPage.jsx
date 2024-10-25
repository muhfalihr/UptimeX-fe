import React from 'react';
import { ArrowLeft, Server, Activity, Network, Database } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Enhanced Card Component with hover effect
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

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg p-4 shadow-xl">
                <p className="text-gray-300 font-medium mb-2">{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                        <p className="text-sm">
                            <span className="text-gray-400">{entry.name}: </span>
                            <span className="font-medium text-white">{entry.value}</span>
                        </p>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export default function ServerDetailPage({ 
    server, 
    systemInfo,
    networkInfo,
    isLoading, 
    error, 
    onBack 
}) {
    const trafficData = networkInfo ? Object.entries(networkInfo.network_info.interfaces)
        .filter(([_, info]) => info.is_up)
        .map(([name, info]) => ({
            name,
            'Bytes Sent (MB)': Number((info.bytes_sent / 1024 / 1024).toFixed(2)),
            'Bytes Received (MB)': Number((info.bytes_recv / 1024 / 1024).toFixed(2)),
            'Packets Sent': info.packets_sent,
            'Packets Received': info.packets_recv,
            'Addresses': info.addresses
        })) : [];

    const totalTraffic = networkInfo ? Object.entries(networkInfo.network_info.interfaces)
        .filter(([_, info]) => info.is_up)
        .map(([name, info]) => ({
            name,
            value: info.bytes_sent + info.bytes_recv
        })) : [];

    const COLORS = ['#60A5FA', '#34D399', '#FBBF24'];
    const GRADIENTS = {
        bytesSent: ['#3B82F6', '#1D4ED8'],
        bytesReceived: ['#10B981', '#047857'],
        packetsSent: ['#8B5CF6', '#6D28D9'],
        packetsReceived: ['#EC4899', '#BE185D']
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Enhanced Header */}
                <div className="flex items-center gap-4 mb-8 bg-gray-800/40 p-4 rounded-xl border border-gray-700/50">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors 
                                 text-blue-400 hover:text-blue-300"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 
                                     bg-clip-text text-transparent">
                            Server Details
                        </h2>
                        <p className="text-gray-400">IP Address: {server.ip_address}</p>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400" />
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 mb-8">
                        <p className="text-red-400 flex items-center gap-2">
                            <Activity className="w-5 h-5" />
                            Error: {error}
                        </p>
                    </div>
                )}

                {/* System Information */}
                {systemInfo && (
                    <div className="mb-8">
                        <Card title="System Information" icon={Server}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {Object.entries(systemInfo.system_info).map(([key, value]) => (
                                    <div 
                                        key={key}
                                        className="bg-gray-700/20 p-4 rounded-lg border border-gray-700/50
                                                 hover:border-blue-500/30 transition-colors"
                                    >
                                        <div className="text-sm text-gray-400 mb-1">
                                            {key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
                                        </div>
                                        <div className="font-medium text-white">{value}</div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}

                {/* Network Dashboard */}
                {networkInfo && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold flex items-center gap-2 text-blue-400">
                            <Network className="w-6 h-6" />
                            Network Information
                        </h3>
                        
                        <Card title="Network Interface Traffic" icon={Activity}>
                            <div className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={trafficData}>
                                        <defs>
                                            {Object.entries(GRADIENTS).map(([key, [startColor, endColor]]) => (
                                                <linearGradient key={key} id={key} x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor={startColor} stopOpacity={0.8}/>
                                                    <stop offset="95%" stopColor={endColor} stopOpacity={0.1}/>
                                                </linearGradient>
                                            ))}
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis 
                                            dataKey="name" 
                                            stroke="#9CA3AF"
                                            tick={{ fill: '#9CA3AF' }}
                                        />
                                        <YAxis 
                                            stroke="#9CA3AF"
                                            tick={{ fill: '#9CA3AF' }}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Area 
                                            type="monotone" 
                                            dataKey="Bytes Sent (MB)" 
                                            stroke={GRADIENTS.bytesSent[0]}
                                            fillOpacity={1} 
                                            fill="url(#bytesSent)" 
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="Bytes Received (MB)" 
                                            stroke={GRADIENTS.bytesReceived[0]}
                                            fillOpacity={1} 
                                            fill="url(#bytesReceived)" 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card title="Packet Distribution" icon={Database}>
                                <div className="h-96">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={trafficData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                            <XAxis 
                                                dataKey="name" 
                                                stroke="#9CA3AF"
                                                tick={{ fill: '#9CA3AF' }}
                                            />
                                            <YAxis 
                                                stroke="#9CA3AF"
                                                tick={{ fill: '#9CA3AF' }}
                                            />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend />
                                            <Area 
                                                type="monotone" 
                                                dataKey="Packets Sent" 
                                                stroke={GRADIENTS.packetsSent[0]}
                                                fillOpacity={1} 
                                                fill="url(#packetsSent)" 
                                            />
                                            <Area 
                                                type="monotone" 
                                                dataKey="Packets Received" 
                                                stroke={GRADIENTS.packetsReceived[0]}
                                                fillOpacity={1} 
                                                fill="url(#packetsReceived)" 
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>

                            <Card title="Total Traffic Distribution" icon={Activity}>
                                <div className="h-96">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={totalTraffic}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={120}
                                                innerRadius={60}
                                                label
                                                paddingAngle={5}
                                            >
                                                {totalTraffic.map((_, index) => (
                                                    <Cell 
                                                        key={`cell-${index}`} 
                                                        fill={COLORS[index % COLORS.length]}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                        </div>

                        <div className="text-sm text-gray-400 flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            Last Updated: {new Date(networkInfo.timestamp).toLocaleString()}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}