import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar/Navbar";
import Sidebar from "./components/layout/Sidebar/Sidebar";
import DashboardPage from "./pages/dashboard/Dashboard";
import ServersPage from "./pages/servers/Servers";
import SettingsPage from "./pages/settings/Settings";
import { ServerProvider } from "./context/ServerContext";

function AppContent() {
    const navigate = useNavigate(); // Use useNavigate for navigation
    const [pageTitle, setPageTitle] = useState("Dashboard");

    const handleItemClick = (title) => {
        setPageTitle(title);
        navigate(`/${title.toLowerCase()}`); // Navigate based on title
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
                        <Routes>
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/servers" element={<ServersPage />} />
                            <Route path="/settings" element={<SettingsPage />} />
                            <Route path="*" element={<DashboardPage />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
    );
}

function App() {
    return (
        <Router>
            <ServerProvider>
                <AppContent />
            </ServerProvider>
        </Router>
    );
}

export default App;
