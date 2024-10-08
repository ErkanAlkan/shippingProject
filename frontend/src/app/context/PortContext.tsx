import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { showErrorAlert } from "~/utils/sweetAlertUtils";

interface PortData {
  origin: string;
  latitude: number;
  longitude: number;
}

interface PortContextProps {
  portOptions: PortData[];
  selectedOriginPort: string | null;
  selectedDestinationPort: string | null;
  setSelectedOriginPort: (port: string | null) => void;
  setSelectedDestinationPort: (port: string | null) => void;
}

const PortContext = createContext<PortContextProps>({
  portOptions: [],
  selectedOriginPort: null,
  selectedDestinationPort: null,
  setSelectedOriginPort: () => {},
  setSelectedDestinationPort: () => {},
});

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const PortProvider = ({ children }: { children: React.ReactNode }) => {
  const [portOptions, setPortOptions] = useState<PortData[]>([]);
  const [selectedOriginPort, setSelectedOriginPort] = useState<string | null>(null);
  const [selectedDestinationPort, setSelectedDestinationPort] = useState<string | null>(null);

  useEffect(() => {
    const fetchPorts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/unique-ports/get-ports`);
        setPortOptions(response.data);
      } catch (error) {
        console.error("Error fetching port options:", error);
        showErrorAlert("Failed to fetch ports");
      }
    };

    fetchPorts();
  }, []);

  return (
    <PortContext.Provider
      value={{ portOptions, selectedOriginPort, selectedDestinationPort, setSelectedOriginPort, setSelectedDestinationPort }}
    >
      {children}
    </PortContext.Provider>
  );
};

export const usePortContext = () => {
  return useContext(PortContext);
};
