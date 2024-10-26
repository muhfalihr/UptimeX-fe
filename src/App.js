import React, { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./components/pages/DashboardPage";
import ServersPage from "./components/pages/ServersPage";
import SettingsPage from "./components/pages/SettingsPage";

function App() {
    const wsserversListStatus = "ws://localhost:12833/ws/servers/list/status";
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
        <div className="min-h-screen bg-gray-900 text-gray-100 w-full">
            <div className="flex">
                {/* Sidebar positioned as sticky to remain on the side */}
                <div className="hidden lg:block lg:sticky top-0 h-screen">
                    <Sidebar onItemClick={handleItemClick} />
                </div>
    
                <div className="flex flex-col min-h-screen w-full">
                    {/* Navbar positioned sticky at the top */}
                    <div className="sticky top-0 z-10 w-full">
                        <Navbar title={pageTitle} />
                    </div>
    
                    {/* Scrollable content section */}
                    <div className="flex-grow p-4 md:p-8 overflow-y-auto
                        scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent
                        hover:scrollbar-thumb-gray-600">
                        {renderPage()}
                    </div>
                </div>
            </div>
        </div>
    );    
}

export default App;
