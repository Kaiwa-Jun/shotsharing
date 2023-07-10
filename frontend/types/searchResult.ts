import { Category } from "./category";

export type SearchResult = {
  id: number;
  user_id: number;
  file_url: string;
  iso: number;
  shutter_speed: number;
  f_value: number;
  camera_model: string;
  latitude: number;
  longitude: number;
  location_enabled: boolean;
  taken_at: string;
  created_at: string;
  updated_at: string;
  categories: Category[];
  exposure_time: number;
};
