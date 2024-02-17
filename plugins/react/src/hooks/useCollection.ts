import { useContext, useEffect, useState } from 'react';
import { AuthContext } from "../context/authContext";
import { setDoc } from '@junobuild/core';
import { nanoid } from "nanoid";

type DocType = {
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
        data: doc
      },
    });
  }
  const myId = nanoid();
  const updatedDoc = (id: string, updates: object) => {
    const index = docs.findIndex(doc => doc.id === myId);
    const updatedDoc = {
      ...docs[index],
      ...updates
    };

    setDocs(prevDocs => {
      const newDocs = [...prevDocs];
      newDocs[index] = updatedDoc;
      return newDocs;
    });
    
    setDoc({
      collection: collectionName, 
      doc: {
        key: id,
        data: updates
      }
    });
  }

  return { 
    docs,
    isLoading,
    error,
    addDoc,
    updatedDoc
   };
};
export default useCollection;

 

