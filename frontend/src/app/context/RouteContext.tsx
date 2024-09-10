"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface RouteContextType {
  globalRouteData: any[];
  setGlobalRouteData: (data: any[]) => void;
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

export const RouteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [globalRouteData, setGlobalRouteData] = useState<any[]>([]);
  

  return (
    <RouteContext.Provider 
      value={{ 
        globalRouteData, 
        setGlobalRouteData
      }}>
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
