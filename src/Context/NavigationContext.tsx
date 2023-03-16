import React, { createContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { findPathToKey } from "../Components/Molecule/SharedLogic/navigationLogic";

interface Props {
  children: React.ReactNode;
}

export const NavigationContext = createContext({
  expandedItems: [""],
  toggleExpandedItems: (id: string) => {},
  currentItem: "",
  setFooBar: (path: string) => {},
});

const NavigationProvider: React.FC<Props> = ({ children }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [currentItem, setCurrentItem] = useState<string>("");

  const toggleExpandedItems = (id: string) => {
    if (expandedItems.includes(id)) {
      setExpandedItems(
        expandedItems.filter((str) => {
          return !str.startsWith(id);
        })
      );
    } else {
      setExpandedItems([...expandedItems, id]);
    }
  };

  const setFooBar = (path: string) => {
    const keys = findPathToKey(path);
    if (keys.length > 0) {
      setCurrentItem(keys[0]);
      keys.slice(1).forEach((key) => {
        if (!expandedItems.includes(key)) {
          setExpandedItems([...expandedItems, key]);
        }
      });
    }
  };

  return (
    <NavigationContext.Provider
      value={{
        expandedItems,
        toggleExpandedItems,
        currentItem,
        setFooBar,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationProvider;
