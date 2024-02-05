import { useState, useEffect } from 'react';
import { getManyDocs } from '@junobuild/core'; // 

interface Doc {
  key: string;
  data: any;
}

// This hook is responsible for fetching documents from a collection
function useDocs(collectionName: string) {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Define an async function to fetch documents
    const fetchDocs = async () => {
      try {
        setLoading(true);
        // Call the API to fetch documents
        const fetchedDocs = await getManyDocs({satellite});
        setDocs(fetchedDocs);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    // Call the fetch function
    fetchDocs();
  }, [collectionName]);

  return { docs, loading, error };
}

export default useDocs;