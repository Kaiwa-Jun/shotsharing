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
  user: {
    id: number;
    display_name: string;
    avatar_url: string | null;
  };
  height?: number;
  width?: number;
}
