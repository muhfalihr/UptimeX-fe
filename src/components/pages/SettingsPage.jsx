import React from 'react';
import { Settings, Bell, Clock, Shield } from 'lucide-react';

// Enhanced Card Component
const Card = ({ children, className = "", title, icon: Icon }) => (
    <div className={`bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 
                     transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 
                     hover:border-blue-500/30 ${className}`}>
        {title && (
            <div className="flex items-center gap-2 mb-4">
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

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <div className="ml-16 p-6 max-w-7xl mx-auto">
                {/* Enhanced Header */}
                <div className="mb-8 bg-gray-800/40 p-4 rounded-xl border border-gray-700/50">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 
                                 bg-clip-text text-transparent flex items-center gap-2">
                        <Settings className="w-6 h-6" />
                        Settings
                    </h2>
                    <p className="text-gray-400 mt-1">
                        Configure your application preferences
                    </p>
                </div>

                <div className="space-y-6">
                    <Card title="General Settings" icon={Shield}>
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">
                                        <Clock className="w-4 h-4 inline-block mr-2" />
                                        Refresh Interval
                                    </label>
                                    <select className="w-full max-w-xs bg-gray-800/40 border border-gray-700/50 
                                                     rounded-lg p-3 text-gray-300 focus:border-blue-500 
                                                     focus:ring-1 focus:ring-blue-500 outline-none transition-all">
                                        <option>30 seconds</option>
                                        <option>1 minute</option>
                                        <option>5 minutes</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card title="Notification Preferences" icon={Bell}>
                        <div className="space-y-4">
                            <label className="flex items-center p-3 bg-gray-800/20 rounded-lg 
                                          border border-gray-700/50 hover:border-blue-500/30 
                                          transition-colors cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    className="form-checkbox h-5 w-5 text-blue-500 rounded 
                                             border-gray-700 bg-gray-800/40"
                                />
                                <span className="ml-3 text-gray-300 group-hover:text-gray-200">
                                    Email Notifications
                                </span>
                            </label>
                            <label className="flex items-center p-3 bg-gray-800/20 rounded-lg 
                                          border border-gray-700/50 hover:border-blue-500/30 
                                          transition-colors cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    className="form-checkbox h-5 w-5 text-blue-500 rounded 
                                             border-gray-700 bg-gray-800/40"
                                />
                                <span className="ml-3 text-gray-300 group-hover:text-gray-200">
                                    Desktop Notifications
                                </span>
                            </label>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}