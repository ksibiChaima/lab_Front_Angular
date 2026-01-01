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
  publications?: string[]; // publication ids
  outils?: string[]; // outil ids
  events?: string[]; // event ids
}