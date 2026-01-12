export interface Evenement {
  id?: string | number;
  titre?: string;
  description?: string;
  date?: string | Date;
  lieu?: string;
  type?: string; // Conference, Workshop, Séminaire, etc.
  dateFin?: string | Date;
  registrationUrl?: string;
  meetingUrl?: string;
  capacite?: number;
  statut?: string;
 
  organisateur?: {
    id?: string | number;
    nom?: string;
    prenom?: string;
    email?: string;
  };
}