"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { RouteData } from '~/app/types/types';

interface RouteContextType {
  globalRouteData: RouteData[];
  setGlobalRouteData: (data: RouteData[]) => void;
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

export const RouteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [globalRouteData, setGlobalRouteData] = useState<RouteData[]>([]);
  console.log("globalRouteData:", globalRouteData);

  return (
    <RouteContext.Provider value={{ globalRouteData, setGlobalRouteData }}>
      {children}
    </RouteContext.Provider>
  );
};

export const useRouteContext = () => {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error('useRouteContext must be used within a RouteProvider');
  }
  return context;
};
