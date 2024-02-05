import { useEffect, useState } from 'react';
import useJuno from './useJuno';

export default function useCollection(collectionName: string) {
  const [docs, setDocs] = useState([]);
  const juno = useJuno("");

  useEffect(() => {
    // Subscribe to the collection and update the state with new docs
    const subscription = juno.subscribeCollection(collectionName, setDocs);

    // Cleanup subscription on component unmount
    return () => {
        subscription.unsubscribe()
    };
 }, [collectionName, juno]);

  return { docs };
}

 

