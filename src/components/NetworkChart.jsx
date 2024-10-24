// NetworkChart.js
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const NetworkChart = () => {
  const [data, setData] = useState([]);

  // Simulate real-time network data for receiving and sending
  useEffect(() => {
    const interval = setInterval(() => {
      const newData = {
        time: new Date().toLocaleTimeString(),
        receiving: Math.floor(Math.random() * 1000),
        sending: Math.floor(Math.random() * 1000)
      };

      // Keep the last 20 data points in the array
      setData((prevData) => [...prevData.slice(-19), newData]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={100}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="receiving" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="sending" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default NetworkChart;
