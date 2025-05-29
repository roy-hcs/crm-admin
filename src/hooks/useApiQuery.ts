import { useQuery } from '@tanstack/react-query';

// Example API function
const fetchData = async (endpoint: string) => {
  const response = await fetch(`/api/${endpoint}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// Sample query hook
export function useApiData<T>(endpoint: string, queryKey: string[]) {
  return useQuery({
    queryKey: queryKey,
    queryFn: () => fetchData(endpoint) as Promise<T>,
  });
}

// Example usage in a component:
// const { data, isLoading, error } = useApiData<UserData>('users', ['users']);
