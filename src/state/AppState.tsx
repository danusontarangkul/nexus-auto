import { createContext, useContext, useState, useMemo } from 'react';

// state/AppState.tsx
type AppState = {
  isAuthenticated: boolean;
  hasCar: boolean;
  subscribe: () => Promise<{ hasCar: boolean }>; // ← return value
  register: () => Promise<{ hasCar: boolean }>;
  completeAddCar: () => void;
  logout: () => void;
};

const AppStateContext = createContext<AppState | null>(null);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCar, setHasCar] = useState(false);

  const subscribe = async (): Promise<{ hasCar: boolean }> => {
    // TODO: real auth + fetch profile
    setIsAuthenticated(true);
    const userHasCar = false; // from API later
    setHasCar(userHasCar);
    return { hasCar: userHasCar };
  };

  const register = async (): Promise<{ hasCar: boolean }> => {
    setIsAuthenticated(true);
    const userHasCar = false;
    setHasCar(userHasCar);
    return { hasCar: userHasCar };
  };

  const completeAddCar = () => setHasCar(true);

  const value = useMemo(
    () => ({
      isAuthenticated,
      hasCar,
      subscribe,
      register,
      completeAddCar,
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
