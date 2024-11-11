import React, { useState, useMemo } from 'react';
import { Clock } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useNetworkTraffic } from '../../hooks/useNetworkTraffic';

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
                            <span className="font-medium text-white">
                                {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value} MB
                            </span>
                        </p>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

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

const NetworkTrafficChart = () => {
    const { networkTrafficData, historicalData } = useNetworkTraffic();
    const { bytesSent, bytesRecv, packetsSent, packetsRecv, errin, errout, dropin, dropout, fifoin, fifoout, timestamps } = historicalData;
    const [timeRange, setTimeRange] = useState('1h');

    const chartData = useMemo(() => {
        if (!timestamps || !bytesSent || !bytesRecv) {
            return [];
        }

        return networkTrafficData.map((timestamp) => ({
            timestamp,
            'Bytes Sent (MB)': Number((bytesSent / (1024 * 1024)).toFixed(2)),
            'Bytes Received (MB)': Number((bytesRecv / (1024 * 1024)).toFixed(2)),
            'Packets Sent': packetsSent ? packetsSent : 0,
            'Packets Received': packetsRecv ? packetsRecv : 0,
            'Error In': errin ? errin : 0,
            'Error Out': errout ? errout : 0,
            'Drop In': dropin ? dropin : 0,
            'Drop Out': dropout ? dropout : 0,
            'FIFO In': fifoin ? fifoin : 0,
            'FIFO Out': fifoout ? fifoout : 0,
        }));
    }, [historicalData]);

    const GRADIENTS = {
        bytesSent: ['#3B82F6', '#1D4ED8'],
        bytesReceived: ['#10B981', '#047857'],
    };

    if (!networkTrafficData) {
        return (
            <Card title="Network Traffic Over Time" icon={Clock}>
                <div className="h-96 flex items-center justify-center">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-gray-400">Connecting to network data...</p>
                    </div>
                </div>
            </Card>
        );
    }

    if (!chartData.length) {
        return (
            <Card title="Network Traffic Over Time" icon={Clock}>
                <div className="h-96 flex items-center justify-center">
                    <p className="text-gray-400">No data available</p>
                </div>
            </Card>
        );
    }

    return (
        <Card title="Network Traffic Over Time" icon={Clock}>
            <TimeRangeSelector selectedRange={timeRange} onRangeChange={setTimeRange} />
            <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            {Object.entries(GRADIENTS).map(([key, [startColor, endColor]]) => (
                                <linearGradient key={key} id={key} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={startColor} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={endColor} stopOpacity={0.1} />
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="timestamp" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                        <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
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
    );
};

export default NetworkTrafficChart;
