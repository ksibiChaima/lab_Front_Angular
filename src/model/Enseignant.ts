import { Member } from './Member';

export interface Enseignant extends Member {
  // teacher/researcher-specific fields
  grade?: string; // e.g., "Maître de conférences", "Professeur"
  departement?: string;
  laboratoire?: string;
  specialites?: string[];
  superviseeIds?: string[]; // ids of students supervised
  urlPersonal?: string; // personal page
}
