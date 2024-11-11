import React, { useState } from 'react';
import { ArrowLeft, Server, Activity, Network, Database, Clock } from 'lucide-react';
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

// Time range selector component
const TimeRangeSelector = ({ selectedRange, onRangeChange }) => (
    <div className="flex gap-2 mb-4">
        {['1h', '6h', '24h', '7d', '30d'].map((range) => (
            <button
                key={range}
                onClick={() => onRangeChange(range)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                    selectedRange === range
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700/50 hover:bg-blue-500/20 text-gray-300'
                }`}
            >
                {range}
            </button>
        ))}
    </div>
);

export default function ServerDetailPage({ 
    server, 
    systemInfo,
    networkInfo,
    isLoading, 
    error, 
    onBack 
}) {
    const [timeRange, setTimeRange] = useState('1h');

    // Generate time-series data for the selected range
    const generateTimeSeriesData = (range) => {
        const now = new Date();
        const data = [];
        const intervals = {
            '1h': { count: 60, unit: 'minute' },
            '6h': { count: 72, unit: '5 minutes' },
            '24h': { count: 96, unit: '15 minutes' },
            '7d': { count: 168, unit: 'hour' },
            '30d': { count: 180, unit: '4 hours' }
        };

        const { count, unit } = intervals[range];
        
        for (let i = count - 1; i >= 0; i--) {
            const time = new Date(now - i * getMillisecondsForUnit(unit));
            const baseValue = Math.random() * 100;
            data.push({
                timestamp: time.toISOString(),
                'Bytes Sent (MB)': Number((baseValue + Math.random() * 20).toFixed(2)),
                'Bytes Received (MB)': Number((baseValue + Math.random() * 30).toFixed(2)),
                'Packets Sent': Math.floor(baseValue * 100),
                'Packets Received': Math.floor(baseValue * 120)
            });
        }
        return data;
    };

    const getMillisecondsForUnit = (unit) => {
        const units = {
            'minute': 60 * 1000,
            '5 minutes': 5 * 60 * 1000,
            '15 minutes': 15 * 60 * 1000,
            'hour': 60 * 60 * 1000,
            '4 hours': 4 * 60 * 60 * 1000
        };
        return units[unit];
    };

    const timeSeriesData = generateTimeSeriesData(timeRange);

    const formatXAxis = (timestamp) => {
        const date = new Date(timestamp);
        switch (timeRange) {
            case '1h':
                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            case '6h':
            case '24h':
                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            case '7d':
                return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit' });
            case '30d':
                return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
            default:
                return timestamp;
        }
    };

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
                {/* Header section remains the same */}
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

                {/* Loading and Error states remain the same */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400" />
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 mb-8">
                        <p className="text-red-400 flex items-center gap-2">
                            <Activity className="w-5 h-5" />
                            Error: {error}
                        </p>
                    </div>
                )}

                {/* System Information section remains the same */}
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

                {/* Network Dashboard with time-based charts */}
                {networkInfo && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold flex items-center gap-2 text-blue-400">
                            <Network className="w-6 h-6" />
                            Network Information
                        </h3>
                        
                        <Card title="Network Traffic Over Time" icon={Clock}>
                            <TimeRangeSelector selectedRange={timeRange} onRangeChange={setTimeRange} />
                            <div className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={timeSeriesData}>
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
                                            dataKey="timestamp"
                                            stroke="#9CA3AF"
                                            tick={{ fill: '#9CA3AF' }}
                                            tickFormatter={formatXAxis}
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
                            <Card title="Packet Traffic Over Time" icon={Database}>
                                <div className="h-96">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={timeSeriesData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                            <XAxis 
                                                dataKey="timestamp"
                                                stroke="#9CA3AF"
                                                tick={{ fill: '#9CA3AF' }}
                                                tickFormatter={formatXAxis}
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

                            {/* Keep the Total Traffic Distribution pie chart */}
                            <Card title="Total Traffic Distribution" icon={Activity}>
                                <div className="h-96">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    { name: 'Bytes Sent', value: timeSeriesData.reduce((acc, curr) => acc + curr['Bytes Sent (MB)'], 0) },
                                                    { name: 'Bytes Received', value: timeSeriesData.reduce((acc, curr) => acc + curr['Bytes Received (MB)'], 0) }
                                                ]}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={120}
                                                innerRadius={60}
                                                label
                                                paddingAngle={5}
                                            >
                                                {COLORS.map((color, index) => (
                                                    <Cell 
                                                        key={`cell-${index}`} 
                                                        fill={color}
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
                            Last Updated: {new Date().toLocaleString()}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}