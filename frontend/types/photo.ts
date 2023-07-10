import { User } from "./user";

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
  categories: any[];
  location_enabled: boolean;
  latitude: number | null;
  longitude: number | null;
  exposure_time: number;
}
