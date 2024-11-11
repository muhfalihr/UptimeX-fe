import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const generateRandomData = (cores) => {
  return Array.from({ length: 60 }, (_, i) => ({
    time: i,
    ...Object.fromEntries(
      Array.from({ length: cores }, (_, j) => [`Core ${j + 1}`, Math.floor(Math.random() * 100)])
    )
  }));
};

const CPUUsageChart = () => {
  const [data, setData] = useState([]);
  const cores = 32;
  const colors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c',
    '#d0ed57', '#ffc0cb', '#40e0d0', '#ff6347', '#7fffd4',
    '#f08080', '#20b2aa', '#ff69b4', '#00ced1', '#ff4500',
    '#48d1cc', '#ff1493', '#00fa9a', '#dc143c', '#00ffff',
    '#ff00ff', '#7cfc00', '#ff8c00', '#00ff7f', '#d8bfd8',
    '#1e90ff', '#db7093', '#f0e68c', '#ff7f50', '#6495ed',
    '#dda0dd', '#90ee90'
  ];

  useEffect(() => {
    setData(generateRandomData(cores));
    const interval = setInterval(() => {
      setData(prevData => {
        const newDataPoint = {
          time: prevData[prevData.length - 1].time + 1,
          ...Object.fromEntries(
            Array.from({ length: cores }, (_, j) => [`Core ${j + 1}`, Math.floor(Math.random() * 100)])
          )
        };
        return [...prevData.slice(1), newDataPoint];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full p-2">
      <div className="p-2 h-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">CPU Usage per Core</h2>
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -10 }} />
            <YAxis label={{ value: 'CPU Usage (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            {Array.from({ length: cores }, (_, i) => (
              <Line
                key={`Core ${i + 1}`}
                type="monotone"
                dataKey={`Core ${i + 1}`}
                stroke={colors[i]}
                dot={false}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CPUUsageChart;