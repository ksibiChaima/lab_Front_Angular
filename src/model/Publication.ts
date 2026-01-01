export interface Publication {
  id: string;
  type?: string;
  titre?: string;
  lien?: string;
  date?: string;
  sourcepdf?: string;
  authorIds?: string[]; // member ids
}
