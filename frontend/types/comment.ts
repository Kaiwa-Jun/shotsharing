import { User } from "./user";

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  photo_id: number;
  user: User;
}
