// src/contexts/ReturnPathContext.tsx
import { createContext, type ReactNode, useContext, useState } from 'react';

type ReturnPathContextType = {
  returnPath: string | null;
  setReturnPath: (path: string | null) => void;
};

const ReturnPathContext = createContext<ReturnPathContextType | null>(null);

export function ReturnPathProvider({ children }: { children: ReactNode }) {
  const [returnPath, setReturnPath] = useState<string | null>(null);

  return (
    <ReturnPathContext.Provider value={{ returnPath, setReturnPath }}>
      {children}
    </ReturnPathContext.Provider>
  );
}

export function useReturnPath() {
  const context = useContext(ReturnPathContext);
  if (context == null) {
    throw new Error('useReturnPath must be used within a ReturnPathProvider');
  }
  return context;
}
