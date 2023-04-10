import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

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
}

type PhotoContextType = {
  photos: Photo[];
  addPhoto: (photo: Photo) => void;
  setAllPhotos: (photos: Photo[]) => void;
  handleImageUpload: (photo: Photo) => void;
};

const PhotoContext = createContext<PhotoContextType>({
  photos: [],
  addPhoto: () => {},
  setAllPhotos: () => {},
  handleImageUpload: () => {},
});

export const usePhotoContext = () => useContext(PhotoContext);

interface PhotoProviderProps {
  children: ReactNode;
}

export const PhotoProvider = ({ children }: PhotoProviderProps) => {
  const [photos, setPhotos] = useState<Photo[]>([]);

  const addPhoto = (photo: Photo) => {
    setPhotos((prevPhotos) => {
      // 既に追加された写真がある場合、追加処理を行わない
      if (prevPhotos.some((p) => p.id === photo.id)) {
        return prevPhotos;
      }

      // 写真を追加する
      return [photo, ...prevPhotos];
    });
  };

  const setAllPhotos = (photos: Photo[]) => {
    setPhotos(photos);
  };

  const handleImageUpload = (photo: Photo) => {
    addPhoto(photo);
  };

  useEffect(() => {
    console.log("A photo has been added or removed.", photos);
  }, [photos.length]);

  return (
    <PhotoContext.Provider
      value={{ photos, addPhoto, setAllPhotos, handleImageUpload }}
    >
      {children}
    </PhotoContext.Provider>
  );
};
