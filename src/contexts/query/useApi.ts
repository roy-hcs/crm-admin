import { useContext } from 'react';
import { ApiContext } from './query-context';

export const useApi = () => useContext(ApiContext);
