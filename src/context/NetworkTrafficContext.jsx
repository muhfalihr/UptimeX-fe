import React, { createContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';

// Konstanta konfigurasi
const TOTAL_POINTS = (12 * 60) / 30;
const STORAGE_KEY = 'server_historical_data';
const UPDATE_INTERVAL = 30000;
const RECONNECT_DELAY = 5000;

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
        bytesSent: 0,
        bytesRecv: 0,
        packetsSent: 0,
        packetsRecv: 0,
        errin: 0,
        errout: 0,
        dropin: 0,
        dropout: 0,
        fifoin: 0,
        fifoout: 0,
        timestamps: generateTimestamps(Date.now(), 30, TOTAL_POINTS),
        lastUpdate: Date.now()
    };
};

export const NetworkTrafficContext = createContext(undefined);

export const NetworkTrafficProvider = ({ children, ipAddress }) => {
    const [historicalData, setHistoricalData] = useState(loadHistoricalData);
    const [networkTrafficData, setNetworkTrafficData] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    const socketRef = useRef(null);
    const lastUpdateRef = useRef(historicalData.lastUpdate);

    const wsNetworkTrafficUrl = useMemo(() => `ws://${ipAddress}:33551/ws/network/iocounters/all`, [ipAddress]);

    const updateHistoricalData = useCallback((data) => {
        const now = Date.now();
        if (now - lastUpdateRef.current < UPDATE_INTERVAL) return;

        const latestData = data[0]; // Mengambil data pertama dari array yang diterima
    
        // Update nilai integer dari historicalData
        setHistoricalData(() => ({
            bytesSent: latestData.bytesSent,
            bytesRecv: latestData.bytesRecv,
            packetsSent: latestData.packetsSent,
            packetsRecv: latestData.packetsRecv,
            errin: latestData.errin,
            errout: latestData.errout,
            dropin: latestData.dropin,
            dropout: latestData.dropout,
            fifoin: latestData.fifoin,
            fifoout: latestData.fifoout,
            timestamps: new Date(latestData.timestamp).toLocaleTimeString(),
            lastUpdate: now
        }));
        lastUpdateRef.current = now;
    }, []);
    
    const connectWebSocket = useCallback(() => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            return;
        }

        socketRef.current = new WebSocket(wsNetworkTrafficUrl);

        socketRef.current.onopen = () => {
            console.log("WebSocket connection established");
            setIsConnected(true);
        };

        socketRef.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setNetworkTrafficData(data); // Menyimpan data yang diterima
                updateHistoricalData(data);   // Memperbarui data historis
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
    }, [wsNetworkTrafficUrl, updateHistoricalData]);

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
        networkTrafficData,
        historicalData,
        isConnected
    }), [networkTrafficData, historicalData, isConnected]);

    return (
        <NetworkTrafficContext.Provider value={contextValue}>
            {children}
        </NetworkTrafficContext.Provider>
    );
};
