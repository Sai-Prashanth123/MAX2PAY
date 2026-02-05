import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const useFetch = (fetchFunction, dependencies = [], options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    showErrorToast = true,
    initialData = null,
    onSuccess = null,
    onError = null,
  } = options;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFunction();
      const responseData = result?.data?.data || result?.data || result;
      setData(responseData);
      
      if (onSuccess) {
        onSuccess(responseData);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      
      if (showErrorToast) {
        toast.error(errorMessage);
      }
      
      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
      setLoading(false);
    } else {
      fetchData();
    }
  }, [fetchData]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch, setData };
};

export default useFetch;
