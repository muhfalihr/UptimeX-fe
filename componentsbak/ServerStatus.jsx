import React from "react";

const ServerStatus = () => {
    return (
        <div className="flex flex-col mb-5 lg:flex-row justify-center gap-x-5 w-full">
            <div className="flex flex-col bg-blue-500 px-4 py-2 rounded-lg shadow-lg" style={{minWidth: '19rem', minHeight: '10rem'}}>
                <p className="text-white text-lg font-bold font-sans flex">Active Server</p>
                <div className="flex justify-center items-center h-full">
                    <p className="text-white text-7xl font-bold text-center" style={{fontFamily: 'sans-serif'}}>50</p>
                </div>
            </div>
            <div className="flex flex-col items-center px-4 py-2">
                <p className="flex text-center text-white text-2xl font-bold font-sans">Total Server</p>
                <div className="flex justify-center items-center h-full">
                    <p className="text-white text-7xl font-bold text-center" style={{fontFamily: 'sans-serif'}}>50</p>
                </div>
            </div>
            <div className="flex flex-col bg-blue-500 px-4 py-2 rounded-lg shadow-lg" style={{minWidth: '19rem', minHeight: '10rem'}}>
                <p className="text-white text-lg font-bold font-sans flex">Dead Server</p>
                <div className="flex justify-center items-center h-full">
                    <p className="text-white text-7xl font-bold text-center" style={{fontFamily: 'sans-serif'}}>50</p>
                </div>
            </div>
        </div>
    )
}

export default ServerStatus;