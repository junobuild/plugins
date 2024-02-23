import {User, authSubscribe} from '@junobuild/core';
import {useEffect, useState} from 'react';

function useAuth() {
  const [user, setUser] = useState<User | undefined | null>(undefined);

  useEffect(() => {
    const unSubscribe = authSubscribe(setUser);

    return () => unSubscribe();
  }, []);
  return user;
}
export default useAuth;
