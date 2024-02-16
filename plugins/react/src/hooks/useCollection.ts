import { useContext, useEffect, useState } from 'react';
import { AuthContext } from "../context/authContext";
import { setDoc } from '@junobuild/core';
import { nanoid } from "nanoid";

type DocType = {
  id: string;
  data: any;
  [key: string]: any;
} // 

 function useCollection(collectionName: string) { 
  const [ docs, setDocs ] = useState<DocType[]>([]);
  const [ isLoading, setLoading ] = useState(false);
  const [ error ] = useState(null);
  const juno =  useContext(AuthContext); // 

  useEffect(() => {
    setLoading(true);
    // Subscribe to the collection and update the state with new docs
    const unsubscribe = juno.subscribeCollection(collectionName, (newDocs) => { 
      setDocs(newDocs);
      setLoading(false);
      }
    );

    // Cleanup subscription on component unmount
    return unsubscribe
    
  }, [collectionName, juno]);

  const addDoc = (doc: DocType) => {
    setDocs(prevDocs => [...prevDocs, doc]);
    setDoc({
      collection: collectionName,
      doc: {
        key : myId,
        data: {
          docs
        }
      },
    });
  }
  const myId = nanoid();
  const updateDoc = (id: string, updates: object) => {
    setDocs(prevDocs => {
      return prevDocs.map(doc => {
        if (doc.id === myId) {
          return {...doc, ...updates};
        }
        return doc;
      });
    });
    
    setDoc({
      collection: collectionName, 
      doc: {
        key: id,
        data: docs,
        ...updates
      }
    });
  }

  return { 
    docs,
    isLoading,
    error,
    addDoc,
    updateDoc
   };
};
export default useCollection;

 

