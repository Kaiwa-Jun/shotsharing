import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Photo } from "../../types/photo";

interface PhotoListProps {
  photos?: Photo[];
}

interface Module {
  default: {
    createConsumer: (url: string) => any;
  };
}

const toFraction = (decimal: number) => {
  if (decimal == null) {
    return "";
  }
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  const len = decimal.toString().length - 2;
  let denominator = Math.pow(10, len);
  let numerator = decimal * denominator;
  const divisor = gcd(numerator, denominator); // Should be more than 1
  numerator /= divisor; // Should be less than 10
  denominator /= divisor;
  if (denominator === 1) return `${numerator}`;
  return `${numerator}/${denominator}`;
};

function RecommendPhotos({ photos = [] }: PhotoListProps): JSX.Element {
  const [imageWidth, setImageWidth] = useState<number>(0);
  const [fixedHeight, setFixedHeight] = useState<number>(300);
  const [showModal, setShowModal] = useState<number | null>(null);
  const [imageRatios, setImageRatios] = useState<Record<number, number>>({});
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

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
  }, [fixedHeight]);

  const toggleModal = (photoId: number) => {
    setShowModal(showModal === photoId ? null : photoId);
  };

  const handleImageLoad = (id: number, event: any) => {
    const { width, height } = event.target;
    setImageRatios((prevRatios) => ({
      ...prevRatios,
      [id]: width / height,
    }));
  };

  return (
    <div className="flex flex-wrap justify-center items-start">
      {photos
        .sort(
          (a: Photo, b: Photo) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .map((photo: Photo) =>
          !photo
            ? null
            : (console.log("photo.user:", photo.user),
              photo.user &&
                console.log(
                  "photo.user.firebase_uid:",
                  photo.user.firebase_uid
                ),
              console.log("currentUserId:", currentUserId),
              (
                <div
                  key={photo.id}
                  className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-2"
                  style={{
                    width: fixedHeight * (imageRatios[photo.id] || 1),
                  }}
                >
                  {photo.file_url ? (
                    <a href={`/photo/${photo.id}`}>
                      <div
                        className="relative rounded-t-lg"
                        style={{ height: fixedHeight }}
                      >
                        <Image
                          className="absolute top-0 left-0 rounded t-lg"
                          src={photo.file_url}
                          alt="Uploaded photo"
                          width={500}
                          height={300}
                          objectFit="cover"
                          objectPosition="center"
                          priority
                          onLoad={(event) => handleImageLoad(photo.id, event)}
                        />
                      </div>
                    </a>
                  ) : (
                    <div>No image available</div>
                  )}
                </div>
              ))
        )}
    </div>
  );
}

export default RecommendPhotos;
