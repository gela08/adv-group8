// NavigationContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the type for the context value
type NavigationContextType = {
  currentPage: string;
  setCurrentPage: (page: string) => void;
};

// Create the context with a default undefined value (to be provided via Provider)
const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

// Create the provider component
export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const [currentPage, setCurrentPage] = useState<string>('home');

  return (
    <NavigationContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </NavigationContext.Provider>
  );
};

// Create a custom hook to use the context
export const usePageNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
