import { User } from "./user";
import { Category } from "./category";

export interface Photo {
  id: number;
  file_url: string;
  image_blob: {
    filename: string;
  };
  camera_model: string;
  shutter_speed: string;
  iso: number;
  f_value: number;
  created_at: string;
  taken_at: string;
  user: User;
  height?: number;
  width?: number;
  commentCount?: number;
  categories: Category[];
  location_enabled: boolean;
  latitude: number | null;
  longitude: number | null;
  exposure_time: number;
  likes_count: number;
  image_url: string;
  category: Category; // categoryプロパティも追加します。
  japanese_name: string; // japanese_nameプロパティを追加
}
