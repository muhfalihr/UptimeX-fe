import React from "react";
import StatusIndicator from "../StatusIndicator/StatusIndicator";
// import { ChevronRight } from "lucide-react";

export default function ServerListItem({ ip, label, status, details }) {
    return (
        <div className="bg-slate-800 rounded-lg flex items-center justify-between">
          <div className="flex items-center px-5 py-5 gap-4 flex-1">
            <span className="text-gray-300 font-mono">{ip}</span>
            <span className="text-white">{label}</span>
          </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-300">Status</span>
            <StatusIndicator status={status} />
          </div>
          <span className="text-gray-400 text-sm">{details}</span>
          <button className="text-gray-400 hover:text-white">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    )
}   