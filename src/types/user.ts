export interface User {
  id: string;
  sideNavVisibility: Map<string, boolean>;
  [key: string]: unknown;
}
