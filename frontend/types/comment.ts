import { User } from "./user";

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  user: User;
  photo_id: number;
}
