import { initJuno } from "@junobuild/core";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";

export default function useJuno(satelliteId: string)  {

  if(!satelliteId) {
    throw new Error('satelliteId is required');
  }
  const auth = useContext(AuthContext)!;
  
  useEffect(() => {
    initJuno({satelliteId});
   }, [satelliteId]);// auth context values 

  return auth;
}
// Should consider handling initialization asynchronusly too
// for in case the @dev wants to keep the same instance's 
// in fixed state.