import React, { createContext, useContext, useState, useMemo } from 'react';

type AppState = {
  isAuthenticated: boolean;
  hasCar: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  completeAddCar: () => void;
  logout: () => void;
};

const AppStateContext = createContext<AppState | null>(null);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [hasCar, setHasCar] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsAuthenticated(true);
      setHasCar(false);
      setIsLoading(false);
    }, 1000);
  };

  const completeAddCar = () => setHasCar(true);

  const logout = () => {
    setIsAuthenticated(false);
    setHasCar(false);
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      hasCar,
      isLoading,
      login,
      completeAddCar,
      logout,
    }),
    [isAuthenticated, hasCar, isLoading],
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return ctx;
};
