"use client";

import { Config, driver, DriveStep } from "driver.js";

import "driver.js/dist/driver.css";
import "@/styles/driver-custom.css";

import { createContext, ReactNode, useCallback, useContext, useEffect, useRef } from "react";

interface TourContextType {
  startTour: (steps: DriveStep[], config?: Partial<Config>) => void;
  stopTour: () => void;
  isActive: () => boolean;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within TourProvider");
  }
  return context;
};

interface TourProviderProperties {
  children: ReactNode;
}

export const TourProvider = ({ children }: TourProviderProperties) => {
  const driverInstance = useRef<ReturnType<typeof driver> | null>(null);

  const startTour = useCallback((steps: DriveStep[], config?: Partial<Config>) => {
    // Destroy existing instance if any
    if (driverInstance.current) {
      driverInstance.current.destroy();
    }

    // Create new driver instance with custom config
    driverInstance.current = driver({
      showProgress: true,
      showButtons: ["next", "previous", "close"],
      steps,
      ...config,
    });

    // Start the tour after 1 second delay
    setTimeout(() => {
      driverInstance.current?.drive();
    }, 1500);
  }, []);

  const stopTour = useCallback(() => {
    if (driverInstance.current) {
      driverInstance.current.destroy();
      driverInstance.current = null;
    }
  }, []);

  const isActive = useCallback(() => {
    return driverInstance.current?.isActive() ?? false;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (driverInstance.current) {
        driverInstance.current.destroy();
      }
    };
  }, []);

  return <TourContext.Provider value={{ startTour, stopTour, isActive }}>{children}</TourContext.Provider>;
};
