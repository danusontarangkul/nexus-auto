import React, { createContext, useContext, useState, useMemo } from 'react';

type AppState = {
  isAuthenticated: boolean;
  hasCar: boolean;
  login: () => void;
  register: () => void;
  completeAddCar: () => void;
  logout: () => void;
};

const AppStateContext = createContext<AppState | null>(null);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCar, setHasCar] = useState(false);

  const value = useMemo(
    () => ({
      isAuthenticated,
      hasCar,
      login: () => setIsAuthenticated(true),
      register: () => setIsAuthenticated(true),
      completeAddCar: () => setHasCar(true),
      logout: () => {
        setIsAuthenticated(false);
        setHasCar(false);
      },
    }),
    [isAuthenticated, hasCar],
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = (): AppState => {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return ctx;
};
