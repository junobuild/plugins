import {User} from '@junobuild/core';
import {createContext} from 'react';

export interface AuthContextType {
  subscribeCollection: (collectionName: string, callback: (docs: any[]) => void) => void;
  user: User | null | undefined;
}

export const AuthContext = createContext<AuthContextType>({
  subscribeCollection: () => {},
  user: null
});
