import React, { useEffect, useState } from "react";
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
  return (
    <div className="flex flex-wrap justify-start items-start">
      {photos.map((photo: Photo) =>
        !photo ? null : (
          <div
            key={photo.id}
            className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-2"
          >
            {photo.file_url ? (
              <a href="#">
                <Image
                  className="rounded-t-lg"
                  src={photo.file_url}
                  alt="Uploaded photo"
                  width={200}
                  height={200}
                  layout="responsive"
                  style={{ objectFit: "cover", objectPosition: "center" }}
                  priority
                />
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
