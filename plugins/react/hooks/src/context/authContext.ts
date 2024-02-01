import { createContext } from  "react";
import { User } from "@junobuild/core";

export interface AuthContextType {
    [x: string]: any;

    user: User | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);
 //default AuthContext;