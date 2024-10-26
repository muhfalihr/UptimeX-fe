import React from "react";

export default function StatusCard({ title, count, color }) {
    return (
        <div className={`bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 
                        transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 
                        hover:border-blue-500/30 h-full`}>
            <div className="flex justify-between items-start">
                <h2 className="text-sm uppercase font-bold bg-gradient-to-r from-blue-400 to-purple-400 
                              bg-clip-text text-transparent">{title}</h2>
                <div className={`w-4 h-4 rounded-full ${color}`}></div>
            </div>
            <div className="flex justify-center items-center mt-4">
                <p className="text-5xl font-bold text-gray-100">{count}</p>
            </div>
        </div>
    );
}
