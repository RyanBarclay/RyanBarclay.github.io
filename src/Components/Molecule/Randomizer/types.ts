export interface Item {
  name: string;
  enabled: boolean;
}

export interface Set {
  name: string;
  enabled: boolean;
  items: Item[];
}
