import { useContext } from "react";
import { NetworkTrafficContext } from '../context/NetworkTrafficContext'

export const useNetworkTraffic = () => {
    const context = useContext(NetworkTrafficContext);
    if (context === undefined) {
        throw new Error('useNetworkTraffic must be used within a NetworkTrafficProvider');
    }
    return context;
};
