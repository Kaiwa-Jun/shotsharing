export interface User {
  id?: number;
  firebase_uid: string;
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
  idToken: string | null;
}
