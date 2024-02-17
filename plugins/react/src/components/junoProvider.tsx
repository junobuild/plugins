import user from "../hooks/useAuth";
import React from "react";

interface junoProviderProps {
   satelliteId: string;
   children: React.ReactNode;
}

export const junoContext = React.createContext(user);

export function JunoProvider({ satelliteId, children }: junoProviderProps) {
     satelliteId

    return (
        <junoContext.Provider value={user}>
            {children}
        </junoContext.Provider>
        
    );
};