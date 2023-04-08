import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getPhotos } from "../utils/api";
import { usePhotoContext } from "../contexts/PhotoContext";

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

interface PhotoListProps {
  photos?: Photo[];
}

function PhotoList({ photos = [] }: PhotoListProps): JSX.Element {
  const [imageWidth, setImageWidth] = useState<number>(0);
  const [fixedHeight, setFixedHeight] = useState<number>(300);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const imageRatio = 4 / 3; // 画像の縦横比
      const height = fixedHeight;
      const width = Math.round(height * imageRatio);
      setImageWidth(width > screenWidth ? screenWidth : width);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-wrap justify-start items-start">
      {photos.map((photo: Photo) =>
        !photo ? null : (
          <div
            key={photo.id}
            className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-2"
            style={{ width: imageWidth }}
          >
            {photo.file_url ? (
              <a href={`/photo/${photo.id}`}>
                <div
                  className="relative rounded-t-lg"
                  style={{ height: fixedHeight }}
                >
                  <Image
                    className="absolute top-0 left-0 rounded-t-lg"
                    src={photo.file_url}
                    alt="Uploaded photo"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                    priority
                  />
                </div>
              </a>
            ) : (
              <div>No image available</div>
            )}
            <div className="p-5">
              <p className="text-gray-500">
                {new Date(photo.created_at).toLocaleString()}
              </p>
              <p className="text-gray-900">カメラ: {photo.camera_model}</p>
              <p className="text-gray-900">ISO: {photo.iso}</p>
              <p className="text-gray-900">F値: {photo.f_value}</p>
              <p className="text-gray-900">
                シャッタースピード: {photo.shutter_speed}
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default PhotoList;
