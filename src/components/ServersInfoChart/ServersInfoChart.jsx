import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

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
        title: {
          display: true,
          text: 'Number of Servers',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Time (Last 12 Hours)',
        },
        ticks: {
          maxTicksLimit: 12, // Menampilkan 12 label waktu untuk membuatnya lebih mudah dibaca
          autoSkip: true,
        }
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
  };

  return (
    <div className="w-full mx-auto mt-5 mb-5">
      <div className="bg-gray-800 h-[30rem] p-4 rounded-lg shadow-lg">
        <Line data={data} options={options} height={null} width={null} />
      </div>
    </div>
  );
}