import React, { useState } from "react";
import { FaHome, FaCog, FaServer } from "react-icons/fa";

const Sidebar = ({onItemClick}) => {
    const [isOpen, setIsOpen] = useState(true)
    const [activeItem, setActiveItem] = useState("Dashboard")

    const toggleSidebar = () => {
        setIsOpen(!isOpen)
    }

    const handleItemClick = (item) => {
        setActiveItem(item)
        onItemClick(item)
    }

    return (
        <div className="flex relative z-0">
            <div
            className={` ${
                isOpen ? "w-56" : "w-20"
            } shadow-xl bg-gray-800 h-screen relative duration-300`}
            >
                <button
                    className="absolute -right-3 top-20 bg-gray-900 border border-gray-700 rounded-full p-1"
                    onClick={toggleSidebar}>
                        <span className="text-gray-300">{isOpen ? "◄" : "►"}</span>
                </button>
                <a href="/dashboard" className="flex px-4 py-2 gap-x-2 items-center bg-gray-900 shadow-lg">
                    <img
                        src="logo.png"
                        alt="Logo"
                        className={`cursor-pointer duration-500 ${
                        isOpen && "rotate-[360deg]"
                        }`}
                    />
                    <h1
                        className={`pt-3 text-white origin-left font-medium text-base duration-200 ${
                        !isOpen && "scale-0"
                        }`}
                    >
                        CheckerFx
                    </h1>
                </a>
                <div className="pt-6 px-4">
                    <ul>
                        <li
                            onClick={() => handleItemClick("Dashboard")} 
                            className={`flex items-center gap-x-4 p-2 text-sm text-gray-300 rounded-md cursor-pointer
                                ${activeItem === "Dashboard" ? "bg-gray-700" : ""
                            }`}
                        >
                            <FaHome className="text-lg hover:text-slate-100" />
                            <span className={`${!isOpen && "hidden"} origin-left duration-200 hover:text-slate-100`}>Dashboard</span>
                        </li>
                        <li
                            onClick={() => handleItemClick("Servers")}
                            className={`flex items-center gap-x-4 p-2 text-sm text-gray-300 rounded-md cursor-pointer
                                ${activeItem === "Servers" ? "bg-gray-700" : ""
                            }`}
                        >
                            <FaServer className="text-lg hover:text-slate-100" />
                            <span className={`${!isOpen && "hidden"} origin-left duration-200 hover:text-slate-100`}>Servers</span>
                        </li>
                        <li
                            onClick={() => handleItemClick("Settings")} 
                            className={`flex items-center gap-x-4 p-2 text-sm text-gray-300 rounded-md cursor-pointer
                                ${activeItem === "Settings" ? "bg-gray-700" : ""
                            }`}
                        >
                            <FaCog className="text-lg hover:text-slate-100" />
                            <span className={`${!isOpen && "hidden"} origin-left duration-200 hover:text-slate-100`}>Settings</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;