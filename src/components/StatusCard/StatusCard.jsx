import React from "react";

export default function StatusCard({ title, count, color }) {
    return (
        <div className="bg-gray-800 shadow-lg rounded-lg p-4 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
                <h2 className="text-sm uppercase mb-2 font-bold">{title}</h2>
                <div className={`w-4 h-4 rounded-full ${color}`}></div>
            </div>
            <div className="flex justify-center items-center flex-grow">
                <p className="text-5xl font-bold">{count}</p>
            </div>
        </div>
    );
}
