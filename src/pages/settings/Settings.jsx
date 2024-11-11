import React, { useState, useEffect } from 'react';
import { Settings, Shield, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import ServersManagement from '../../config/ServerManagement';

// Enhanced Card Component with animation
const Card = ({ children, className = "", title, icon: Icon, description }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm 
                   rounded-xl p-6 border border-gray-700/50 
                   transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 
                   hover:border-blue-500/30 ${className}`}>
        {title && (
            <div className="flex items-center gap-3 mb-4">
                {Icon && (
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Icon className="w-5 h-5 text-blue-400" />
                    </div>
                )}
                <div>
                    <h4 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-400 
                                 bg-clip-text text-transparent">
                        {title}
                    </h4>
                    {description && (
                        <p className="text-sm text-gray-400 mt-1">{description}</p>
                    )}
                </div>
            </div>
        )}
        {children}
    </motion.div>
);

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("Servers");

    const tabs = [
        { id: "Servers", label: "Server Management", icon: Settings, description: "Manage your server configurations and deployment settings" },
        { id: "Roles", label: "Role Management", icon: Shield, description: "Configure user roles and permissions" },
        { id: "Users", label: "User Management", icon: Users, description: "Manage user accounts and access controls" }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case "Servers":
                return <ServersManagement />;
            case "Roles":
                return <div>Role Management Component</div>;
            case "Users":
                return <div>User Management Component</div>;
            default:
                return <ServersManagement />;
        }
    };

    // This useEffect will set the active tab to "Servers" on component mount
    useEffect(() => {
        setActiveTab("Servers");
    }, []);

    return (
        <div className="min-h-screen w-full text-gray-100">
            <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-gray-800/40 to-gray-700/40 p-6 rounded-xl 
                             border border-gray-700/50 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-500/10 rounded-xl">
                                <Settings className="w-8 h-8 text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 
                                             bg-clip-text text-transparent">
                                    Settings
                                </h2>
                                <p className="text-gray-400 mt-1">Manage your application settings and preferences</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
                
                {/* Tabs Navigation */}
                <div className="flex gap-4 mb-6 border-b border-gray-700/50">
                    {tabs.map((tab) => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)} 
                            className={`p-4 flex items-center gap-2 transition-all duration-300
                                      ${activeTab === tab.id 
                                        ? "border-b-2 border-blue-500 text-blue-400" 
                                        : "text-gray-400 hover:text-gray-300"}`}>
                            <tab.icon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <motion.div 
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6">
                    <Card 
                        title={tabs.find(t => t.id === activeTab)?.label} 
                        icon={tabs.find(t => t.id === activeTab)?.icon}
                        description={tabs.find(t => t.id === activeTab)?.description}
                    >
                        {renderTabContent()}
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
