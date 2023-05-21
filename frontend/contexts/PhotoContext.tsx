import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Photo } from "../types/photo"; // Import the Photo type from /types/photo

export type { Photo } from "../types/photo";

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

  const fetchPhotos = async () => {
    try {
      const res = await fetch("/api/photos");
      const data = await res.json();
      setPhotos(data.photos);
    } catch (error) {
      console.error("Failed to fetch photos", error);
    }
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
