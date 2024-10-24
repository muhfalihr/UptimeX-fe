import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ServerMemoryChart = () => {
  const [memoryData, setMemoryData] = useState([]);

  useEffect(() => {
    // Function to simulate fetching real-time data
    const fetchData = () => {
      const totalMemory = 16384; // Total memory in MB (16 GB for this example)
      const usedMemory = Math.floor(Math.random() * 12000) + 2000; // Random used memory between 2-14 GB
      const freeMemory = totalMemory - usedMemory;
      const swapUsed = Math.floor(Math.random() * 2000); // Random swap usage between 0-2 GB

      setMemoryData([
        { name: 'Used Memory', value: usedMemory },
        { name: 'Free Memory', value: freeMemory },
        { name: 'Swap Used', value: swapUsed },
      ]);
    };

    // Fetch initial data
    fetchData();

    // Set up interval to fetch data every 5 seconds
    const interval = setInterval(fetchData, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes) => {
    const gb = (bytes / 1024).toFixed(2);
    return `${gb} GB`;
  };

  return (
    <div className="w-full max-w-md p-4">
      <h2 className="text-xl font-bold text-white mb-4">Server Memory Usage</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={memoryData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {memoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatBytes(value)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ServerMemoryChart;