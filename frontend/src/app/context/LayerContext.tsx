import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LayerContextType {
  showCycloneLayers: boolean;
  setShowCycloneLayers: React.Dispatch<React.SetStateAction<boolean>>;
}

const LayerContext = createContext<LayerContextType | undefined>(undefined);

export const LayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showCycloneLayers, setShowCycloneLayers] = useState<boolean>(true);

  useEffect(() => {
    const savedShowCycloneLayers = localStorage.getItem('showCycloneLayers');
    if (savedShowCycloneLayers !== null) setShowCycloneLayers(savedShowCycloneLayers === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('showCycloneLayers', showCycloneLayers.toString());
  }, [showCycloneLayers]);

  return (
    <LayerContext.Provider value={{ showCycloneLayers, setShowCycloneLayers }}>
      {children}
    </LayerContext.Provider>
  );
};

export const useLayerContext = () => {
  const context = useContext(LayerContext);
  if (!context) {
    throw new Error('useLayerContext must be used within a LayerProvider');
  }
  return context;
};
