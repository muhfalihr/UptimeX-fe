import React, { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./components/pages/DashboardPage";
import ServersPage from "./components/pages/ServersPage";
import SettingsPage from "./components/pages/SettingsPage";

function App() {
    const wsserversListStatus = "ws://localhost:12833/ws/servers/list/status"
    const [pageTitle, setPageTitle] = useState("Dashboard");
    const [serverData, setServerData] = useState({
        server_status_list: [],
        timestamp: null
    });
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = new WebSocket(wsserversListStatus);
        
        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setServerData(data);
        };

        socketRef.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    const handleItemClick = (title) => {
        setPageTitle(title)
    }

    const renderPage = () => {
        switch(pageTitle) {
            case "Dashboard":
                return <DashboardPage serverData={serverData} />;
            case "Servers":
                return <ServersPage serverData={serverData} />;
            case "Settings":
                return <SettingsPage />;
            default:
                return <DashboardPage serverData={serverData} />;
        }
    }

    return (
        <div className="flex bg-contain bg-slate-600 h-screen w-full">
            <Sidebar onItemClick={handleItemClick}/>
            <div className="flex-1 flex flex-col h-screen">
                <Navbar title={pageTitle}/>
                <div className="flex-1 overflow-y-auto p-3 
                    scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent
                    hover:scrollbar-thumb-gray-500
                    dark:scrollbar-thumb-gray-700 dark:hover:scrollbar-thumb-gray-600">
                    {renderPage()}
                </div>
            </div>
        </div>
    );
}

export default App;