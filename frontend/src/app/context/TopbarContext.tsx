import React, { createContext, useContext, useState, ReactNode } from "react";

interface TopbarContextType {
  showTopbar: boolean;
  showTopbarForCarbon: boolean;
  toggleTopbar: () => void;
  toggleTopbarForCarbon: () => void;
}

const TopbarContext = createContext<TopbarContextType | undefined>(undefined);

export const TopbarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showTopbar, setShowTopbar] = useState(true);
  const [showTopbarForCarbon, setShowTopbarForCarbon] = useState(true);

  const toggleTopbar = () => setShowTopbar((prev) => !prev);
  const toggleTopbarForCarbon = () => setShowTopbarForCarbon((prev) => !prev);

  return (
    <TopbarContext.Provider value={{ showTopbar, showTopbarForCarbon, toggleTopbar, toggleTopbarForCarbon }}>
      {children}
    </TopbarContext.Provider>
  );
};

export const useTopbarContext = () => {
  const context = useContext(TopbarContext);
  if (!context) {
    throw new Error("useTopbarContext must be used within a TopbarProvider");
  }
  return context;
};
