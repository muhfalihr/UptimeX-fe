import React from 'react';

export default function SettingsPage() {
    return (
        <div className="min-h-screen text-gray-300 font-sans">
            <div className="ml-16 p-6">
                <h2 className="text-2xl font-bold mb-4">Settings</h2>
                <div className="bg-gray-800 rounded-lg p-4">
                    <div className="mb-4">
                        <h3 className="text-xl mb-2">General Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Refresh Interval
                                </label>
                                <select className="bg-gray-700 rounded p-2 w-full max-w-xs">
                                    <option>30 seconds</option>
                                    <option>1 minute</option>
                                    <option>5 minutes</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Notification Settings
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input type="checkbox" className="mr-2"/>
                                        Email Notifications
                                    </label>
                                    <label className="flex items-center">
                                        <input type="checkbox" className="mr-2"/>
                                        Desktop Notifications
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
