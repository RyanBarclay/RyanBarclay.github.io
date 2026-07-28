export interface Item {
  name: string;
  enabled: boolean;
}

export interface ItemSet {
  name: string;
  enabled: boolean;
  items: Item[];
}
