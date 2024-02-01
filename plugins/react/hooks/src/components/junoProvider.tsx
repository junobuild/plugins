import { User } from "@junobuild/core";
import { createContext, useState } from "react";
//import  AuthContext  from "../context/authContext";

interface AuthState {
    user: User | null;
}

export const AuthContext = createContext<AuthState | null>(null);

export default function AuthProvider({ children }: {
    children: React.ReactNode
}) {
    const [state, setState] = useState<AuthState>({
        user: null
      });


    return (
        <AuthContext.Provider value={state}>
            {children}
        </AuthContext.Provider>
    );
}