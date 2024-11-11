import React, { useState } from "react";
import { 
    LayoutDashboard, 
    Server, 
    Settings, 
    ChevronLeft, 
    ChevronRight,
    Activity
} from 'lucide-react';

const MenuItem = ({ icon: Icon, text, isActive, onClick, isOpen }) => (
    <li
        onClick={onClick}
        className={`flex items-center gap-x-4 p-3 mx-3 text-sm rounded-lg cursor-pointer
            transition-all duration-300
            ${isActive 
                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
                : "text-gray-400 hover:bg-gray-800/40 hover:text-gray-200"
            }`}
    >
        <Icon className={`w-5 h-5 ${isActive ? "text-blue-400" : ""}`} />
        <span className={`${!isOpen && "hidden"} origin-left duration-200`}>
            {text}
        </span>
    </li>
);

const Sidebar = ({onItemClick}) => {
    const [isOpen, setIsOpen] = useState(true);
    const [activeItem, setActiveItem] = useState("Dashboard");

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleItemClick = (item) => {
        setActiveItem(item);
        onItemClick(item);
    };

    return (
        <div className="flex relative z-20">
            <div className={`${isOpen ? "w-64" : "w-20"} 
                           bg-gray-800/40 backdrop-blur-sm border-r border-gray-700/50
                           h-screen relative duration-300`}
            >
                {/* Toggle Button */}
                <button
                    className="absolute -right-3 top-20 bg-gray-800 border border-gray-700/50 
                             rounded-full p-1.5 hover:bg-gray-700 transition-colors
                             hover:border-blue-500/30"
                    onClick={toggleSidebar}
                >
                    {isOpen 
                        ? <ChevronLeft className="w-4 h-4 text-gray-400" />
                        : <ChevronRight className="w-4 h-4 text-gray-400" />
                    }
                </button>

                {/* Logo Section */}
                <div className="flex px-4 py-4 items-center border-b border-gray-700/50">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg 
                                      bg-blue-500/10 border border-blue-500/20">
                            <Activity className={`w-6 h-6 text-blue-400 duration-500 
                                               ${isOpen && "rotate-[360deg]"}`} />
                        </div>
                        <div className={`${!isOpen && "hidden"} duration-300`}>
                            <h2 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 
                                         bg-clip-text text-transparent">
                                UptimeX
                            </h2>
                            <p className="text-xs text-gray-400">Server Monitor</p>
                        </div>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="pt-6">
                    <ul className="space-y-2">
                        <MenuItem
                            icon={LayoutDashboard}
                            text="Dashboard"
                            isActive={activeItem === "Dashboard"}
                            onClick={() => handleItemClick("Dashboard")}
                            isOpen={isOpen}
                        />
                        <MenuItem
                            icon={Server}
                            text="Servers"
                            isActive={activeItem === "Servers"}
                            onClick={() => handleItemClick("Servers")}
                            isOpen={isOpen}
                        />
                        <MenuItem
                            icon={Settings}
                            text="Settings"
                            isActive={activeItem === "Settings"}
                            onClick={() => handleItemClick("Settings")}
                            isOpen={isOpen}
                        />
                    </ul>
                </div>

                {/* Footer Section */}
                <div className={`absolute bottom-0 w-full p-4 border-t border-gray-700/50
                                ${!isOpen && "hidden"}`}>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        System Status: Online
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
