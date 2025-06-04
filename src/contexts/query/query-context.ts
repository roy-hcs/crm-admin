import { ApiContextType } from '@/api/hooks/types';
import { createContext } from 'react';

export const ApiContext = createContext<ApiContextType>({} as ApiContextType);
