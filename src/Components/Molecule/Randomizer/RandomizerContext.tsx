import React, { createContext, useContext, useState } from "react";
import { Set, Item } from "./types";

interface RandomResult {
  setName: string;
  selectedItem: Item | null;
}

interface RandomizerContextType {
  sets: Set[];
  addSet: (name: string) => void;
  updateSet: (name: string, updates: Partial<Set>) => void;
  removeSet: (name: string) => void;
  addItem: (setName: string, itemName: string) => void;
  updateItem: (
    setName: string,
    itemName: string,
    updates: Partial<Item>
  ) => void;
  removeItem: (setName: string, itemName: string) => void;
  randomizeSelections: () => RandomResult[];
}

const RandomizerContext = createContext<RandomizerContextType | undefined>(
  undefined
);

export const RandomizerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sets, setSets] = useState<Set[]>([]);

  const addSet = (name: string) => {
    // Check if set with this name already exists
    if (sets.some((set) => set.name === name)) {
      alert(`A set with the name "${name}" already exists.`);
      return;
    }

    setSets((prev) => [
      ...prev,
      {
        name,
        enabled: true,
        items: [],
      },
    ]);
  };

  const updateSet = (name: string, updates: Partial<Set>) => {
    // If updating the name, check if the new name already exists
    if (
      updates.name &&
      updates.name !== name &&
      sets.some((set) => set.name === updates.name)
    ) {
      alert(`A set with the name "${updates.name}" already exists.`);
      return;
    }

    setSets((prev) =>
      prev.map((set) => (set.name === name ? { ...set, ...updates } : set))
    );
  };

  const removeSet = (name: string) => {
    setSets((prev) => prev.filter((set) => set.name !== name));
  };

  const addItem = (setName: string, itemName: string) => {
    setSets((prev) =>
      prev.map((set) => {
        if (set.name === setName) {
          // Check if item with this name already exists in the set
          if (set.items.some((item) => item.name === itemName)) {
            alert(
              `An item with the name "${itemName}" already exists in this set.`
            );
            return set;
          }

          return {
            ...set,
            items: [
              ...set.items,
              {
                name: itemName,
                enabled: true,
              },
            ],
          };
        }
        return set;
      })
    );
  };

  const updateItem = (
    setName: string,
    itemName: string,
    updates: Partial<Item>
  ) => {
    setSets((prev) =>
      prev.map((set) => {
        if (set.name === setName) {
          // If updating the name, check if the new name already exists
          if (
            updates.name &&
            updates.name !== itemName &&
            set.items.some((item) => item.name === updates.name)
          ) {
            alert(
              `An item with the name "${updates.name}" already exists in this set.`
            );
            return set;
          }

          return {
            ...set,
            items: set.items.map((item) =>
              item.name === itemName ? { ...item, ...updates } : item
            ),
          };
        }
        return set;
      })
    );
  };

  const removeItem = (setName: string, itemName: string) => {
    setSets((prev) =>
      prev.map((set) => {
        if (set.name === setName) {
          return {
            ...set,
            items: set.items.filter((item) => item.name !== itemName),
          };
        }
        return set;
      })
    );
  };

  const randomizeSelections = (): RandomResult[] => {
    return sets
      .filter((set) => set.enabled)
      .map((set) => {
        const enabledItems = set.items.filter((item) => item.enabled);

        if (enabledItems.length === 0) {
          return {
            setName: set.name,
            selectedItem: null,
          };
        }

        // Select a random item from the enabled items
        const randomIndex = Math.floor(Math.random() * enabledItems.length);

        return {
          setName: set.name,
          selectedItem: enabledItems[randomIndex],
        };
      });
  };

  return (
    <RandomizerContext.Provider
      value={{
        sets,
        addSet,
        updateSet,
        removeSet,
        addItem,
        updateItem,
        removeItem,
        randomizeSelections,
      }}
    >
      {children}
    </RandomizerContext.Provider>
  );
};

export const useRandomizer = () => {
  const context = useContext(RandomizerContext);
  if (context === undefined) {
    throw new Error("useRandomizer must be used within a RandomizerProvider");
  }
  return context;
};
