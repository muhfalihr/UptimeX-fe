import React from "react";
import CPUUsageChartPerHour from './MiniLineChart';
import ServerMemoryChart from './PieChart';
import NetworkChart from "./NetworkChart";

const TopServer = () => {
    return (
        <div className="w-full max-w-none rounded-lg shadow-lg">
            {/* Wrapper untuk Flexbox */}
            <div className="flex justify-between items-center grid grid-cols-2 gap-4 w-full">
                <div className="flex-1 mx-2 overflow-x-auto">
                    <CPUUsageChartPerHour />
                </div>
                <div className="flex-1 mx-2">
                    <ServerMemoryChart />
                </div>
                <div className="flex-1 mx-2">
                    <NetworkChart />
                </div>
            </div>
        </div>
    );
}

export default TopServer;
