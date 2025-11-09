// hooks/useContestContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ContestContextType {
  currentContest: string | null;
  setCurrentContest: (address: string) => void;
  clearCurrentContest: () => void;
}

const ContestContext = createContext<ContestContextType | undefined>(undefined);

export function ContestProvider({ children }: { children: ReactNode }) {
  const [currentContest, setCurrentContest] = useState<string | null>(null);

  const value: ContestContextType = {
    currentContest,
    setCurrentContest: (address: string) => setCurrentContest(address),
    clearCurrentContest: () => setCurrentContest(null),
  };

  return (
    <ContestContext.Provider value={value}>
      {children}
    </ContestContext.Provider>
  );
}

export function useContestContext() {
  const context = useContext(ContestContext);
  if (context === undefined) {
    throw new Error('useContestContext must be used within a ContestProvider');
  }
  return context;
}