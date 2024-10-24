import { AlertTriangle } from "lucide-react";
import React from "react";

export default function StatusIndicator({ status }) {
    if (status === 'warning') {
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      }
      
      const getStatusColor = (status) => {
        switch (status) {
          case 'error': return 'bg-red-500';
          case 'warning': return 'bg-yellow-500';
          default: return 'bg-gray-500';
        }
      };
    
      return <div className={`h-3 w-3 rounded-full ${getStatusColor(status)}`} />;
}