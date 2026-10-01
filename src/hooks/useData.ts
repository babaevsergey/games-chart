import { useEffect, useState } from 'react';
import type { Response } from '../types';

const useData = () => {
  const [data, setData] = useState<Response>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate a slow request so the loading state is visible.
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const response = await fetch('/data.json');

        if (!response.ok) {
          throw new Error(`Failed to load data (HTTP ${response.status}).`);
        }

        const jsonData: Response = await response.json();
        setData(jsonData);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Failed to load data.',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default useData;
