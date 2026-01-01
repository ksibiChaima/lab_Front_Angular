export interface Evenement {
  id: string;
  titre?: string;
  date?: string; // single-date events
  date_deb?: string;
  date_fin?: string;
  lieu?: string;
}