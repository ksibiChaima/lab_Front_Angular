// Interfaces TypeScript pour le backend
export interface Evenement {
  id?: number;
  titre: string;
  description?: string;
  date: Date;
  lieu: string;
  type?: string; // Conference, Workshop, Séminaire, etc.
  dateFin?: Date;
  registrationUrl?: string;
  meetingUrl?: string;
  capacite?: number;
  statut?: string; // Prévu, En cours, Terminé, Annulé
  organisateur?: {
    id?: number;
    nom?: string;
    prenom?: string;
    email?: string;
  };
}

export interface Publication {
  id?: number;
  type?: string; // Article, Chapitre, Livre, etc.
  titre: string;
  description?: string;
  resume?: string; // Résumé de la publication
  date: Date;
  lien?: string; // Lien vers l'article en ligne
  sourcePdf?: string; // Lien vers le PDF
  categorie?: string; // Domaine: IA, Sécurité, etc.
  journal?: string; // Journal ou conférence de publication
  doi?: string; // DOI de la publication
  auteur?: {
    id?: number;
    nom?: string;
    prenom?: string;
    email?: string;
  };
  coAuteur?: {
    id?: number;
    nom?: string;
    prenom?: string;
    email?: string;
  };
  motsCles?: string; // Mots-clés pour la recherche
  statut?: string; // Publié, Soumis, Révisé
  citations?: number; // Nombre de citations
  metadata?: string; // URL vers les données supplémentaires
}

export interface Outil {
  id?: number;
  titre?: string;
  description?: string;
  date: Date;
  source?: string; // Code source ou nom du projet
  sourceUrl?: string; // URL vers le code source
  github?: string; // Lien vers le dépôt GitHub
  demoUrl?: string; // URL vers une démo en ligne
  language?: string; // Langage de programmation
  version?: string; // Version de l'outil
  technologies?: string; // Technologies utilisées (séparées par des virgules)
  frameworks?: string; // Frameworks utilisés
  licence?: string; // Type de licence
  auteur?: {
    id?: number;
    nom?: string;
    prenom?: string;
    email?: string;
  };
  coDeveloppeur?: {
    id?: number;
    nom?: string;
    prenom?: string;
    email?: string;
  };
  documentationUrl?: string; // Documentation
  stars?: number; // Nombre d'étoiles sur GitHub
  forks?: number; // Nombre de forks
  statut?: string; // Actif, Maintenance, Déprécié
  tags?: string; // Tags pour la recherche
  downloadUrl?: string; // URL vers les binaires compilés
}

export interface Member {
  id?: number;
  nom?: string;
  prenom?: string;
  email?: string;
  type?: string;
  grade?: string;
  etablissement?: string;
  dateInscription?: Date;
  cvUrl?: string;
  photoUrl?: string;
  sujet?: string;
  supervisedStudents?: Member[];
  publications?: Publication[];
  outils?: Outil[];
  events?: Evenement[];
  encadrant?: Member;
}
