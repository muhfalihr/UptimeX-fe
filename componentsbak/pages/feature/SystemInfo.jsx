import React from 'react';
import { Card } from './Card';
import { Server, User } from 'lucide-react';

const SystemInformation = ({ systemInfo }) => {
  // Exclude 'users' from system info grid
  const systemInfoEntries = Object.entries(systemInfo)
    .filter(([key]) => key !== 'users');

  // Format timestamp to human-readable date
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="mb-8">
      <Card title="System Information" icon={Server}>
        {/* System Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {systemInfoEntries.map(([key, value]) => (
            <div 
              key={key}
              className="bg-gray-700/20 p-4 rounded-lg border border-gray-700/50
                       hover:border-blue-500/30 transition-colors"
            >
              <div className="text-sm text-gray-400 mb-1">
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}
              </div>
              <div className="font-medium text-white">
                {key === 'boot_time' || key === 'uptime' 
                  ? formatTimestamp(value) 
                  : value}
              </div>
            </div>
          ))}
        </div>

        {/* Users Section */}
        {systemInfo.users && systemInfo.users.length > 0 && (
          <div>
            <div className="flex items-center mb-4">
              <User className="mr-2 text-gray-400" />
              <h3 className="text-lg font-semibold text-white">Active Users</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-700/30">
                    <th className="p-3 text-left text-sm text-gray-300">User</th>
                    <th className="p-3 text-left text-sm text-gray-300">Terminal</th>
                    <th className="p-3 text-left text-sm text-gray-300">Host</th>
                    <th className="p-3 text-left text-sm text-gray-300">Started</th>
                  </tr>
                </thead>
                <tbody>
                  {systemInfo.users.map((user, index) => (
                    <tr 
                      key={index} 
                      className="border-b border-gray-700/20 hover:bg-gray-700/10"
                    >
                      <td className="p-3 text-white">{user.user}</td>
                      <td className="p-3 text-gray-400">{user.terminal}</td>
                      <td className="p-3 text-gray-400">{user.host}</td>
                      <td className="p-3 text-gray-400">
                        {formatTimestamp(user.started)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SystemInformation;