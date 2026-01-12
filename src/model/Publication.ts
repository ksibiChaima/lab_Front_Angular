export interface Publication {
  id?: string | number;
  type?: string;
  titre?: string;
  lien?: string;
  date?: string | Date;
  sourcePdf?: string;
  sourcepdf?: string;
  authorIds?: Array<string | number>;

  description?: string;
  resume?: string;
  categorie?: string;
  journal?: string;
  doi?: string;
  auteur?: {
    id?: string | number;
    nom?: string;
    prenom?: string;
    email?: string;
  };
  coAuteur?: {
    id?: string | number;
    nom?: string;
    prenom?: string;
    email?: string;
  };
  motsCles?: string;
  statut?: string;
  citations?: number;
  metadata?: string;
}
