import { Member } from './Member';

export interface Etudiant extends Member {
  // student-specific fields
  niveau?: 'licence' | 'master' | 'phd' | string;
  encadreurId?: string; // primary supervisor (member id)
  cotutelle?: boolean;
  sujetThese?: string;
  anneeInscription?: string; // ISO date or year
  diplome?: string;
}
