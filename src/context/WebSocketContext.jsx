import React, { createContext, useEffect, useRef, useState } from 'react';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ websocket, children }) => {
    const socketRef = useRef(null);
    const [serverStatus, setServerStatus] = useState({
        active: 0,
        timeout: 0,
        inaccessible: 0,
        total: 0,
        timestamp: '',
    });

    useEffect(() => {
        socketRef.current = new WebSocket(websocket);

        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const servers = data.server_status_list;

            const activeServers = servers.filter(server => server.status === "active").length;
            const timeoutServers = servers.filter(server => server.status === "timeout").length;
            const inaccessibleServers = servers.filter(server => server.status === "unaccessible").length;

            setServerStatus({
                active: activeServers,
                timeout: timeoutServers,
                inaccessible: inaccessibleServers,
                total: servers.length,
                timestamp: new Date(data.timestamp).toLocaleTimeString(),
            });
        };

        socketRef.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [websocket]);

    return (
        <WebSocketContext.Provider value={serverStatus}>
            {children}
        </WebSocketContext.Provider>
    );
};
