import React from "react";
import { Bell, User } from 'lucide-react';

const Navbar = ({title}) => {
    return (
        <nav className="w-100 bg-gray-800/40 backdrop-blur-lg border-b border-gray-700/50 p-3 relative z-10">
            <div className="w-full mx-auto flex justify-between items-center">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 
                                 bg-clip-text text-transparent">
                        {title}
                    </h1>
                    <p className="text-xs md:text-sm text-gray-400">Welcome to your server dashboard</p>
                </div>

                <div className="flex items-center gap-4 md:gap-6">
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-gray-400 hover:text-blue-400 transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                        </button>
                        <div className="w-px h-6 bg-gray-700/50"></div>
                        <button className="flex items-center gap-2 p-2 text-gray-400 hover:text-blue-400 transition-colors">
                            <User className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
