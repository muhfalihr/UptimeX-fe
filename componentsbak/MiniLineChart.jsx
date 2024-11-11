import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const generateRandomData = (cores) => {
  return Array.from({ length: 5 }, (_, i) => ({
    time: `${i + 1}h`,
    ...Object.fromEntries(
      Array.from({ length: cores }, (_, j) => [`Core ${j + 1}`, Math.floor(Math.random() * 100)])
    )
  }));
};

const CPUUsageChartPerHour = () => {
  const [data, setData] = useState([]);
  const [selectedCore, setSelectedCore] = useState(null);
  const [hoveredLine, setHoveredLine] = useState(null);
  const cores = 32;
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  const legendRef = useRef(null);
  const scrollPosition = useRef(0);

  useEffect(() => {
    setData(generateRandomData(cores));
    const interval = setInterval(() => {
      setData(prevData => {
        const newDataPoint = {
          time: `${parseInt(prevData[prevData.length - 1].time) + 1}h`,
          ...Object.fromEntries(
            Array.from({ length: cores }, (_, j) => [`Core ${j + 1}`, Math.floor(Math.random() * 100)])
          )
        };
        return [...prevData.slice(1), newDataPoint];
      });
    }, 3600000);

    return () => clearInterval(interval);
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    if (selectedCore && !payload.some(p => p.dataKey === selectedCore)) {
      return null;
    }

    const currentLine = selectedCore || hoveredLine;
    if (!currentLine) return null;

    const filteredPayload = payload.filter(p => p.dataKey === currentLine);
    if (filteredPayload.length === 0) return null;

    return (
      <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
        <p className="text-gray-400">{`Time: ${label}`}</p>
        {filteredPayload.map((entry, index) => (
          <p key={index} className="text-white">
            <span style={{ color: entry.color }}>{entry.name}</span>
            {`: ${entry.value}%`}
          </p>
        ))}
      </div>
    );
  };

  const renderCustomLegend = () => {
    return (
      <div
        ref={legendRef}
        className="overflow-x-auto whitespace-nowrap pb-2 hide-scrollbar"
        onScroll={() => {
          // Update the scroll position on scroll
          scrollPosition.current = legendRef.current.scrollLeft;
        }}
      >
        {Array.from({ length: cores }, (_, i) => (
          <span 
            key={`Core ${i + 1}`} 
            className="mr-4 cursor-pointer"
            style={{ 
              color: colors[i % colors.length],
              opacity: selectedCore && selectedCore !== `Core ${i + 1}` ? 0.2 : 1
            }}
            onClick={() => {
              const newCore = selectedCore === `Core ${i + 1}` ? null : `Core ${i + 1}`;
              setSelectedCore(newCore);

              // Restore the scroll position after setting the new state
              setTimeout(() => {
                if (legendRef.current) {
                  legendRef.current.scrollLeft = scrollPosition.current; // Restore scroll position
                }
              }, 0);
            }}
            onMouseEnter={() => setHoveredLine(`Core ${i + 1}`)}
            onMouseLeave={() => setHoveredLine(null)}
          >
            <span 
              className="inline-block w-3 h-3 mr-1" 
              style={{ backgroundColor: colors[i % colors.length] }}
            />
            Core {i + 1}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full py-10 px-10 bg-gray-800 text-white rounded-lg">
      <h3 className="text-l font-bold text-center mb-4">
        CPU Usage Per Hour
        {selectedCore && (
          <button 
            className="ml-4 text-sm bg-gray-700 px-2 py-1 rounded-md hover:bg-gray-600"
            onClick={() => setSelectedCore(null)}
          >
            Reset Selection
          </button>
        )}
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 10,
          }}
          onMouseLeave={() => setHoveredLine(null)}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#555" />
          <XAxis dataKey="time" stroke="#999" />
          <YAxis stroke="#999" />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ stroke: '#666', strokeWidth: 1 }}
          />
          <Legend content={renderCustomLegend} />
          {Array.from({ length: cores }, (_, i) => (
            <Line
              key={`Core ${i + 1}`}
              type="monotone"
              dataKey={`Core ${i + 1}`}
              stroke={colors[i % colors.length]}
              strokeWidth={2}
              dot={false}
              onClick={() => setSelectedCore(selectedCore === `Core ${i + 1}` ? null : `Core ${i + 1}`)}
              opacity={selectedCore && selectedCore !== `Core ${i + 1}` ? 0.2 : 1}
              onMouseEnter={() => setHoveredLine(`Core ${i + 1}`)}
              onMouseLeave={() => setHoveredLine(null)}
              activeDot={{ r: hoveredLine === `Core ${i + 1}` ? 4 : 0 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CPUUsageChartPerHour;
