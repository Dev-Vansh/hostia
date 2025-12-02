import { useState, useEffect, useCallback } from 'react';

// Custom hook for real-time data polling with auto-refresh
export const useRealtimeData = (fetchFunction, refreshInterval = 30000) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setError(null);
            const result = await fetchFunction();
            setData(result);
            setLastUpdated(new Date());
            return result;
        } catch (err) {
            setError(err);
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    }, [fetchFunction]);

    useEffect(() => {
        // Initial fetch
        fetchData();

        // Set up polling interval
        if (refreshInterval > 0) {
            const interval = setInterval(fetchData, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [fetchData, refreshInterval]);

    // Manual refetch function
    const refetch = useCallback(async () => {
        setLoading(true);
        return await fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch, lastUpdated };
};
