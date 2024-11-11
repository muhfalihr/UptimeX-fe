import React, { createContext, useState, useEffect, useContext, useRef, useCallback, useMemo } from 'react';

// Konstanta konfigurasi
const TOTAL_POINTS = (12 * 60) / 30; // 24 point untuk 12 jam dengan interval 30 menit
const STORAGE_KEY = 'server_historical_data';
const UPDATE_INTERVAL = 30000; // 30 detik
const RECONNECT_DELAY = 5000; // 5 detik delay untuk reconnect

// Fungsi utilitas untuk menghasilkan timestamp
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

// Fungsi memuat data historis
const loadHistoricalData = () => {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            return JSON.parse(savedData);
        }
    } catch (error) {
        console.error('Error loading historical data:', error);
    }
    
    return {
        activeServers: new Array(TOTAL_POINTS).fill(0),
        timeoutServers: new Array(TOTAL_POINTS).fill(0),
        unaccessibleServers: new Array(TOTAL_POINTS).fill(0),
        timestamps: generateTimestamps(Date.now(), 30, TOTAL_POINTS),
        lastUpdate: Date.now()
    };
};

// Membuat context dengan nilai awal yang aman
const ServerContext = createContext(undefined);

// Komponen Provider
export const ServerProvider = ({ children }) => {
    const [serverData, setServerData] = useState({
        server_status_list: [],
        timestamp: Date.now()
    });
    const [historicalData, setHistoricalData] = useState(loadHistoricalData);
    const [isConnected, setIsConnected] = useState(false);

    const socketRef = useRef(null);
    const lastUpdateRef = useRef(historicalData.lastUpdate);

    const wsServerStatusUrl = useMemo(() => "ws://localhost:12833/ws/servers/list/status", []);

    const updateHistoricalData = useCallback((data) => {
        const now = Date.now();
        if (now - lastUpdateRef.current < UPDATE_INTERVAL) return;

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
    }, []);

    const connectWebSocket = useCallback(() => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            return;
        }

        socketRef.current = new WebSocket(wsServerStatusUrl);
        
        socketRef.current.onopen = () => {
            console.log("WebSocket connection established");
            setIsConnected(true);
        };

        socketRef.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setServerData(data);
                updateHistoricalData(data);
            } catch (error) {
                console.error("Error parsing WebSocket message:", error);
            }
        };

        socketRef.current.onerror = (error) => {
            console.error("WebSocket error:", error);
            setIsConnected(false);
            setTimeout(connectWebSocket, RECONNECT_DELAY);
        };

        socketRef.current.onclose = () => {
            console.log("WebSocket connection closed. Attempting to reconnect...");
            setIsConnected(false);
            setTimeout(connectWebSocket, RECONNECT_DELAY);
        };
    }, [wsServerStatusUrl, updateHistoricalData]);

    useEffect(() => {
        connectWebSocket();

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [connectWebSocket]);

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

    const contextValue = useMemo(() => ({
        serverData,
        historicalData,
        isConnected
    }), [serverData, historicalData, isConnected]);

    return (
        <ServerContext.Provider value={contextValue}>
            {children}
        </ServerContext.Provider>
    );
};

// Hook kustom
export const useServerData = () => {
    const context = useContext(ServerContext);
    if (context === undefined) {
        throw new Error('useServerData must be used within a ServerProvider');
    }
    return context;
};
