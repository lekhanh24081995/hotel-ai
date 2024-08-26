'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { LOCAL_STORAGE_KEY } from '../lib/constants/common';

export interface DashboardProviderProps {
  children?: ReactNode;
}
export interface DashboardContextModel {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isMobileSidebarOpen: boolean;
  toggleMobileSidebar: () => void;
  isLoading: boolean;
}

export const DashboardContext = createContext<DashboardContextModel>({
  isSidebarOpen: false,
  toggleSidebar: () => {},
  isMobileSidebarOpen: false,
  toggleMobileSidebar: () => {},
  isLoading: true
} as DashboardContextModel);

export const useDashboardContext = (): DashboardContextModel => {
  return useContext(DashboardContext);
};

export const DashboardProvider = ({ children }: DashboardProviderProps) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const value = localStorage.getItem(LOCAL_STORAGE_KEY.SIDEBAR);
    if (value) {
      setSidebarOpen(JSON.parse(value));
    }
    setLoading(false);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((value) => {
      const newState = !value;
      localStorage.setItem(LOCAL_STORAGE_KEY.SIDEBAR, JSON.stringify(newState));
      return newState;
    });
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen((value) => !value);
  };

  const values = useMemo(
    () => ({
      isSidebarOpen,
      toggleSidebar,
      isMobileSidebarOpen,
      toggleMobileSidebar,
      isLoading
    }),
    [isSidebarOpen, isMobileSidebarOpen, isLoading]
  );

  if (isLoading) {
    return null;
  }

  return (
    <DashboardContext.Provider value={values}>
      {children}
    </DashboardContext.Provider>
  );
};
