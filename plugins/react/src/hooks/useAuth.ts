import {useState, useEffect,} from "react";
import { authSubscribe, User } from "@junobuild/core";

export default function useAuth() {

    const [user, setUser] = useState<User | undefined | null>(undefined);

    useEffect(() => {
        const unSubscribe = authSubscribe(setUser);

        return () => unSubscribe();

    }, []);
    return user;
}