import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, Server } from 'lucide-react';
import ServerDetailPage from './ServerDetailPage';
import { useServerData } from '../../context/ServerContext';

const Card = ({ children, className = "", title, icon: Icon }) => (
    <div className={`bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 
                     transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 
                     hover:border-blue-500/30 ${className}`}>
        {title && (
            <div className="flex items-center justify-center gap-2 mb-4">
                {Icon && <Icon className="w-5 h-5 text-blue-400" />}
                <h4 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-400 
                              bg-clip-text text-transparent">
                    {title}
                </h4>
            </div>
        )}
        {children}
    </div>
);

export default function ServersPage() {
    const [selectedServer, setSelectedServer] = useState(null);
    const [systemInfo, setSystemInfo] = useState(null);
    const [networkInfo, setNetworkInfo] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { serverData } = useServerData();
    const [error, setError] = useState(null);
    const wsRef = useRef(null);

    // Cleanup WebSocket connection when component unmounts
    useEffect(() => {
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    const setupWebSocket = (ipAddress) => {
        // Close existing WebSocket if any
        if (wsRef.current) {
            wsRef.current.close();
        }

        // Create new WebSocket connection
        wsRef.current = new WebSocket(`ws://localhost:12833/servers/network_info?ip_address=${ipAddress}`);

        wsRef.current.onopen = () => {
            console.log('WebSocket connection established');
        };

        wsRef.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setNetworkInfo(data);
            } catch (err) {
                console.error('Error parsing WebSocket data:', err);
                setError('Failed to parse network information');
            }
        };

        wsRef.current.onerror = (error) => {
            console.error('WebSocket error:', error);
            setError('Failed to connect to network monitoring');
        };

        wsRef.current.onclose = () => {
            console.log('WebSocket connection closed');
        };
    };

    const fetchSystemInfo = async (ipAddress) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `http://localhost:12833/servers/system_info?ip_address=${ipAddress}`
            );
            if (!response.ok) {
                throw new Error('Failed to fetch system info');
            }
            const data = await response.json();
            setSystemInfo(data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching system info:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleServerClick = async (server) => {
        setSelectedServer(server);
        setNetworkInfo(null); // Reset network info when selecting new server
        
        if (server.ip_address) {
            await fetchSystemInfo(server.ip_address);
            setupWebSocket(server.ip_address);
        }
    };

    const handleBack = () => {
        setSelectedServer(null);
        setSystemInfo(null);
        setNetworkInfo(null);
        setError(null);
        
        // Close WebSocket connection when navigating back
        if (wsRef.current) {
            wsRef.current.close();
        }
    };

    const renderLabels = (labels) => {
        if (!labels) return '-';

        if (Array.isArray(labels)) {
            return (
                <div className="flex flex-wrap gap-1">
                    {labels.map((label, idx) => (
                        <span
                            key={idx}
                            className="px-2 py-0.5 bg-gray-700 text-xs rounded-full"
                        >
                            {label}
                        </span>
                    ))}
                </div>
            );
        }

        return labels;
    };

    const filteredServers = useMemo(() => {
        return serverData.server_status_list.filter(server => {
            const searchString = searchTerm.toLowerCase();
            return (
                (server.name || '').toLowerCase().includes(searchString) ||
                (Array.isArray(server.labels) && 
                    server.labels.some(label => 
                        label.toLowerCase().includes(searchString)
                    )) ||
                server.status.toLowerCase().includes(searchString)
            );
        });
    }, [serverData.server_status_list, searchTerm]);

    const highlightMatch = (text, term) => {
        if (!term.trim()) return text;

        const regex = new RegExp(`(${term})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, i) => 
            regex.test(part) ? (
                <span key={i} className="bg-yellow-500/30 text-white">
                    {part}
                </span>
            ) : part
        );
    };

    return (
        <div className="w-full bg-gray-900 text-gray-100">
            <div className="w-full max-w-7xl mx-auto">
                <Card className="w-full mb-8">
                    {selectedServer ? (
                        <ServerDetailPage 
                            server={selectedServer}
                            systemInfo={systemInfo}
                            networkInfo={networkInterfacesInfo}
                            isLoading={isLoading}
                            error={error}
                            onBack={handleBack}
                        />
                    ) : (
                        <>
                            {/* Enhanced Header */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 
                                             bg-clip-text text-transparent flex items-center gap-2">
                                    <Server className="w-6 h-6" />
                                    Server Management
                                </h2>
                                <p className="text-gray-400 mt-1">
                                    Manage and monitor all connected servers
                                </p>
                            </div>

                            {/* Enhanced Search Bar */}
                            <div className="mb-6 relative">
                                <div className={`
                                    flex items-center gap-2 p-3 
                                    bg-gray-800/40 backdrop-blur-sm
                                    border-2 rounded-xl transition-all duration-300
                                    ${isSearchFocused 
                                        ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                                        : 'border-gray-700/50'}
                                `}>
                                    <Search className="w-5 h-5 text-blue-400" />
                                    <input
                                        type="text"
                                        placeholder="Search servers, labels, or status..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onFocus={() => setIsSearchFocused(true)}
                                        onBlur={() => setIsSearchFocused(false)}
                                        className="
                                            flex-1 bg-transparent outline-none 
                                            text-gray-200 placeholder-gray-500
                                        "
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={() => setSearchTerm('')}
                                            className="p-1 hover:bg-gray-700 rounded-full transition-colors"
                                        >
                                            <X className="w-4 h-4 text-gray-400" />
                                        </button>
                                    )}
                                </div>
                                
                                {searchTerm && (
                                    <div className="absolute right-2 -bottom-6 text-sm text-gray-400">
                                        Found {filteredServers.length} results
                                    </div>
                                )}
                            </div>

                            {/* Enhanced Table */}
                            <div className="overflow-x-auto rounded-xl border border-gray-700/50">
                                <table className="w-full">
                                    <thead className="bg-gray-800/40">
                                        <tr>
                                            <th className="text-left p-4 text-gray-400 font-medium">Server Name</th>
                                            <th className="text-left p-4 text-gray-400 font-medium">Labels</th>
                                            <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                                            <th className="text-left p-4 text-gray-400 font-medium">Last Check</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredServers.map((server, index) => (
                                            <tr 
                                                key={index} 
                                                className="border-t border-gray-700/50 hover:bg-gray-700/30 
                                                         transition-colors cursor-pointer"
                                                onClick={() => handleServerClick(server)}
                                            >
                                                <td className="p-4">
                                                    {highlightMatch(server.ip_address || `Server ${index + 1}`, searchTerm)}
                                                </td>
                                                <td className="p-4">
                                                    {renderLabels(server.labels)}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                                                        ${server.status === 'active' ? 'bg-green-500/20 text-green-400' : 
                                                        server.status === 'timeout' ? 'bg-yellow-500/20 text-yellow-400' : 
                                                        'bg-red-500/20 text-red-400'}`}
                                                    >
                                                        {highlightMatch(server.status, searchTerm)}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-gray-400">
                                                    {new Date(serverData.timestamp).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Enhanced No Results Message */}
                            {searchTerm && filteredServers.length === 0 && (
                                <div className="text-center py-12 text-gray-400 bg-gray-800/20 
                                              rounded-xl border border-gray-700/50 mt-4">
                                    <Search className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                                    <p>No servers found matching "{searchTerm}"</p>
                                </div>
                            )}
                        </>
                    )}
                </Card>
            </div>
        </div>
    );
}