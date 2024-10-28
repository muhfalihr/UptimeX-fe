import React, { createContext, useState, useEffect, useContext, useRef } from 'react';

const ServerContext = createContext(null);
const TOTAL_POINTS = (12 * 60) / 30; // 24 points for 12 hours with 30-minute intervals
const STORAGE_KEY = 'server_historical_data';

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

// Function to load data from localStorage
const loadHistoricalData = () => {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            return JSON.parse(savedData);
        }
    } catch (error) {
        console.error('Error loading historical data:', error);
    }
    
    // Return default data if no saved data exists
    return {
        activeServers: new Array(TOTAL_POINTS).fill(0),
        timeoutServers: new Array(TOTAL_POINTS).fill(0),
        unaccessibleServers: new Array(TOTAL_POINTS).fill(0),
        timestamps: generateTimestamps(Date.now(), 30, TOTAL_POINTS),
        lastUpdate: Date.now()
    };
};

export function ServerProvider({ children }) {
    const [serverData, setServerData] = useState({
        server_status_list: [],
        timestamp: Date.now()
    });
    const [historicalData, setHistoricalData] = useState(loadHistoricalData);
    const socketRef = useRef(null);
    const lastUpdateRef = useRef(historicalData.lastUpdate);

    // Save to localStorage whenever historical data changes
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                ...historicalData,
                lastUpdate: Date.now()
            }));
        } catch (error) {
            console.error('Error saving historical data:', error);
        }
    }, [historicalData]);

    useEffect(() => {
        const connectWebSocket = () => {
            const wsserversListStatus = "ws://localhost:12833/ws/servers/list/status";
            socketRef.current = new WebSocket(wsserversListStatus);
            
            socketRef.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setServerData(data);
                
                // Only update historical data if enough time has passed (e.g., 30 seconds)
                const now = Date.now();
                if (now - lastUpdateRef.current >= 30000) { // 30 seconds
                    if (data.server_status_list && data.server_status_list.length > 0) {
                        const activeCount = data.server_status_list.filter(server => server.status === 'active').length;
                        const timeoutCount = data.server_status_list.filter(server => server.status === 'timeout').length;
                        const unaccessibleCount = data.server_status_list.filter(server => server.status === 'unaccessible').length;
                        const newTime = new Date(data.timestamp).toLocaleTimeString();

                        setHistoricalData(prev => ({
                            activeServers: [...prev.activeServers.slice(1), activeCount],
                            timeoutServers: [...prev.timeoutServers.slice(1), timeoutCount],
                            unaccessibleServers: [...prev.unaccessibleServers.slice(1), unaccessibleCount],
                            timestamps: [...prev.timestamps.slice(1), newTime],
                            lastUpdate: now
                        }));
                        lastUpdateRef.current = now;
                    }
                }
            };

            socketRef.current.onerror = (error) => {
                console.error("WebSocket error:", error);
                setTimeout(connectWebSocket, 5000);
            };

            socketRef.current.onclose = () => {
                console.log("WebSocket connection closed. Attempting to reconnect...");
                setTimeout(connectWebSocket, 5000);
            };
        };

        connectWebSocket();

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    const value = {
        serverData,
        historicalData
    };

    return (
        <ServerContext.Provider value={value}>
            {children}
        </ServerContext.Provider>
    );
}

export function useServerData() {
    const context = useContext(ServerContext);
    if (context === null) {
        throw new Error('useServerData must be used within a ServerProvider');
    }
    return context;
}