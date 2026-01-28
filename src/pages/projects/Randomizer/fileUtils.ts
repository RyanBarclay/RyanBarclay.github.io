import { ItemSet, Item } from "./types";

/**
 * Parse a text file content into a set
 * @param content Text content from the imported file
 * @returns Parsed Set object
 */
export const parseSetFile = (content: string): ItemSet | null => {
  const lines = content.trim().split("\n");

  if (lines.length === 0) {
    return null;
  }

  // First line is the set name
  const setName = lines[0].trim();

  if (!setName) {
    return null;
  }

  const items: Item[] = [];

  // Parse remaining lines as items
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check if the line starts with "- " for items
    if (line.startsWith("- ")) {
      const itemName = line.substring(2).trim();
      if (itemName) {
        items.push({
          name: itemName,
          enabled: true, // Default to enabled
        });
      }
    }
  }

  return {
    name: setName,
    enabled: true, // Default to enabled
    items,
  };
};

/**
 * Convert a set to the text file format
 * @param set The set to convert
 * @returns Formatted text content
 */
export const setToFileContent = (set: ItemSet): string => {
  let content = set.name + "\n";

  set.items.forEach((item) => {
    content += `- ${item.name}\n`;
  });

  return content;
};

/**
 * Download a set as a text file
 * @param set The set to download
 */
export const downloadSet = (set: ItemSet) => {
  const content = setToFileContent(set);
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${set.name}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
