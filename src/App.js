import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./components/pages/DashboardPage";
import ServersPage from "./components/pages/ServersPage";
import SettingsPage from "./components/pages/SettingsPage";
import { ServerProvider } from "./context/ServerContext";

function AppContent() {
    const [pageTitle, setPageTitle] = useState("Dashboard");

    const handleItemClick = (title) => {
        setPageTitle(title);
    };

    const renderPage = () => {
        switch(pageTitle) {
            case "Dashboard":
                return <DashboardPage />;
            case "Servers":
                return <ServersPage />;
            case "Settings":
                return <SettingsPage />;
            default:
                return <DashboardPage />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 w-full">
            <div className="flex">
                <div className="hidden lg:block lg:sticky top-0 h-screen">
                    <Sidebar onItemClick={handleItemClick} />
                </div>
    
                <div className="flex flex-col min-h-screen w-full">
                    <div className="sticky top-0 z-10 w-full">
                        <Navbar title={pageTitle} />
                    </div>
    
                    <div className="flex justify-center p-4 md:p-8 overflow-y-auto
                        scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent
                        hover:scrollbar-thumb-gray-600">
                        {renderPage()}
                    </div>
                </div>
            </div>
        </div>
    );
}

function App() {
    return (
        <ServerProvider>
            <AppContent />
        </ServerProvider>
    );
}

export default App;