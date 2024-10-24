import React from 'react';

export default function ServersPage({ serverData }) {
    return (
        <div className="min-h-screen text-gray-300 font-sans">
            <div className="ml-16 p-6">
                <h2 className="text-2xl font-bold mb-4">Servers Management</h2>
                <div className="bg-gray-800 rounded-lg p-4">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="text-left p-2">Server Name</th>
                                <th className="text-left p-2">Status</th>
                                <th className="text-left p-2">Last Check</th>
                            </tr>
                        </thead>
                        <tbody>
                            {serverData.server_status_list.map((server, index) => (
                                <tr key={index} className="border-t border-gray-700">
                                    <td className="p-2">{server.name || `Server ${index + 1}`}</td>
                                    <td className="p-2">
                                        <span className={`px-2 py-1 rounded-full text-sm 
                                            ${server.status === 'active' ? 'bg-green-500' : 
                                            server.status === 'timeout' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                                            {server.status}
                                        </span>
                                    </td>
                                    <td className="p-2">{new Date(serverData.timestamp).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
