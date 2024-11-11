import { useContext } from "react";
import { ServerContext } from "../context/ServerContext";

export const useServerData = () => {
    const context = useContext(ServerContext);
    if (context === undefined) {
        throw new Error('useServerData must be used within a ServerProvider');
    }
    return context;
};
