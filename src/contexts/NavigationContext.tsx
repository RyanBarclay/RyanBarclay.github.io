import React, { createContext, useState } from "react";

interface Props {
  children: React.ReactNode;
}

export const NavigationContext = createContext({
  currentRoute: "",
  setCurrentRoute: (path: string) => {},
});

const NavigationProvider: React.FC<Props> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<string>("");

  return (
    <NavigationContext.Provider
      value={{
        currentRoute,
        setCurrentRoute,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationProvider;
