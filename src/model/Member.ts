export interface Member {
  id: string;
  cin?: string;
  firstName?: string;
  lastName?: string;
  name?: string; // legacy/fullname
  type?: 'student' | 'enseignant' | 'admin' | 'researcher' | string;
  createDate?: string;
  birthDate?: string;
  photoUrl?: string;
  cvUrl?: string;
  email?: string;
  password?: string;
  grade?: string; // for enseignants
  etablissement?: string;
  diploma?: string; // for students
  dateInscription?: string;
  supervisedStudents?: string[]; // member ids
  publications?: any[]; // publication beans or ids
  outils?: any[]; // outil objects or ids
  events?: any[]; // event objects or ids
  encadrant?: any;
}