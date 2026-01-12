export interface Outil {
  id?: string | number;
  date?: string | Date;
  source?: string;
  sourceUrl?: string;
  authorIds?: Array<string | number>;

  titre?: string;
  description?: string;
  github?: string;
  demoUrl?: string;
  language?: string;
  version?: string;
  technologies?: string;
  frameworks?: string;
  licence?: string;
  auteur?: {
    id?: string | number;
    nom?: string;
    prenom?: string;
    email?: string;
  };
  coDeveloppeur?: {
    id?: string | number;
    nom?: string;
    prenom?: string;
    email?: string;
  };
  documentationUrl?: string;
  stars?: number;
  forks?: number;
  statut?: string;
  tags?: string;
  downloadUrl?: string;
}
