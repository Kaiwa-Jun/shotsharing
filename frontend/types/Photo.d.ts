interface Photo {
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
}

export default Photo;
