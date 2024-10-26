import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { Activity } from 'lucide-react';

const generateTimestamps = (startTime, intervalMinutes, points) => {
    const timestamps = [];
    let currentTime = new Date(startTime);
    currentTime.setHours(currentTime.getHours() - 12);
    
    for (let i = 0; i < points; i++) {
        const hours = currentTime.getHours().toString().padStart(2, '0');
        const minutes = currentTime.getMinutes().toString().padStart(2, '0');
        timestamps.push(`${hours}:${minutes}`);
        currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
    }
    
    return timestamps;
};

const TOTAL_POINTS = (12 * 60) / 30;

export default function ServerInfoChart({ serverData }) {
    const [activeServers, setActiveServers] = useState(new Array(TOTAL_POINTS).fill(0));
    const [timeoutServers, setTimeoutServers] = useState(new Array(TOTAL_POINTS).fill(0));
    const [unaccessibleServers, setUnaccessibleServers] = useState(new Array(TOTAL_POINTS).fill(0));
    const [timestampLabels, setTimestampLabels] = useState(generateTimestamps(Date.now(), 30, TOTAL_POINTS));

    useEffect(() => {
        if (serverData.server_status_list.length > 0) {
            const activeCount = serverData.server_status_list.filter(server => server.status === 'active').length;
            const timeoutCount = serverData.server_status_list.filter(server => server.status === 'timeout').length;
            const unaccessibleCount = serverData.server_status_list.filter(server => server.status === 'unaccessible').length;

            setActiveServers(prev => [...prev.slice(1), activeCount]);
            setTimeoutServers(prev => [...prev.slice(1), timeoutCount]);
            setUnaccessibleServers(prev => [...prev.slice(1), unaccessibleCount]);
            
            if (serverData.timestamp) {
                const newTime = new Date(serverData.timestamp).toLocaleTimeString();
                setTimestampLabels(prev => [...prev.slice(1), newTime]);
            }
        }
    }, [serverData]);

    const data = {
        labels: timestampLabels,
        datasets: [
            {
                label: 'Active Servers',
                data: activeServers,
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                borderColor: 'rgba(34, 197, 94, 1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Server Timeouts',
                data: timeoutServers,
                backgroundColor: 'rgba(234, 179, 8, 0.2)',
                borderColor: 'rgba(234, 179, 8, 1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Inaccessible Servers',
                data: unaccessibleServers,
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                borderColor: 'rgba(239, 68, 68, 1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const options = {
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(75, 85, 99, 0.2)',
                },
                ticks: {
                    color: '#9CA3AF',
                },
                title: {
                    display: true,
                    text: 'Number of Servers',
                    color: '#9CA3AF',
                    font: {
                        size: 12,
                        weight: 'bold',
                    },
                },
            },
            x: {
                grid: {
                    color: 'rgba(75, 85, 99, 0.2)',
                },
                ticks: {
                    color: '#9CA3AF',
                    maxTicksLimit: 12,
                    autoSkip: true,
                },
                title: {
                    display: true,
                    text: 'Time (Last 12 Hours)',
                    color: '#9CA3AF',
                    font: {
                        size: 12,
                        weight: 'bold',
                    },
                },
            },
        },
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    color: '#9CA3AF',
                    padding: 20,
                    font: {
                        size: 12,
                    },
                },
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(17, 24, 39, 0.8)',
                titleColor: '#F3F4F6',
                bodyColor: '#D1D5DB',
                borderColor: 'rgba(75, 85, 99, 0.2)',
                borderWidth: 1,
            },
        },
    };

    return (
        <div className="w-full mx-auto mt-8 mb-8">
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 
                          transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 
                          hover:border-blue-500/30">
                <div className="flex items-center gap-2 mb-6">
                    <Activity className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-400 
                                 bg-clip-text text-transparent">
                        Server Status Timeline
                    </h3>
                </div>
                <div className="h-[30rem]">
                    <Line data={data} options={options} height={null} width={null} />
                </div>
                {serverData.timestamp && (
                    <div className="mt-4 text-sm text-gray-400 flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Last Updated: {new Date(serverData.timestamp).toLocaleString()}
                    </div>
                )}
            </div>
        </div>
    );
}
