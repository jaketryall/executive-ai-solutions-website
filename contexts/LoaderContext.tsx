"use client";

import { createContext, useContext, useState } from "react";

interface LoaderContextType {
  isLoaderComplete: boolean;
  setIsLoaderComplete: (value: boolean) => void;
}

const LoaderContext = createContext<LoaderContextType>({
  isLoaderComplete: false,
  setIsLoaderComplete: () => {},
});

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [isLoaderComplete, setIsLoaderComplete] = useState(false);

  return (
    <LoaderContext.Provider value={{ isLoaderComplete, setIsLoaderComplete }}>
      {children}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  return useContext(LoaderContext);
}
