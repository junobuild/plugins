import useJuno from "./useJuno";
//import { AuthContextType } from "../context/interfaces";

export default function useCollection() {
    
    const juno = useJuno("");

    return {
        subscribe(cb: any) {
            return juno.subsribeCollection("name", cb);

        }
    }
}

 

