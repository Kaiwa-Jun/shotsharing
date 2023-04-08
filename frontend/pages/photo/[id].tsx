import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getPhotoById } from "../../utils/api";
import { Photo } from "../../types/photo";
import HeroSection from "../../components/organisms/HeroSection";

interface PhotoDetailProps {
  initialPhoto: Photo | null;
}

const PhotoDetail: React.FC<PhotoDetailProps> = ({ initialPhoto }) => {
  const [photo, setPhoto] = useState<Photo | null>(initialPhoto);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!initialPhoto && id) {
      getPhotoById(id).then((photo) => setPhoto(photo));
    }
  }, [id, initialPhoto]);

  if (!photo) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <HeroSection />
      <div className="my-7">
        <div className="flex items-center justify-center my-5">
          <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
            <img
              src={
                photo.user && photo.user.avatar_url
                  ? photo.user.avatar_url
                  : "/path/to/default/avatar.png"
              }
              alt="User avatar"
            />
          </div>
          <div className="py-1 ml-6 text-2xl">
            <p className="text-gray-900">
              {photo.user ? photo.user.display_name : "Loading..."}
            </p>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-1/4">
            <img src={photo.file_url} alt="Uploaded photo" className="w-full" />
            <p className="text-gray-500">
              {new Date(photo.created_at).toLocaleString()}
            </p>
          </div>
          <div className="p-4 w-1/4">
            <p className="text-gray-900">カメラ: {photo.camera_model}</p>
            <p className="text-gray-900">ISO: {photo.iso}</p>
            <p className="text-gray-900">F値: {photo.f_value}</p>
            <p className="text-gray-900">
              シャッタースピード: {photo.shutter_speed}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id;

  if (!id || typeof id !== "string") {
    return { notFound: true };
  }

  const photo = await getPhotoById(id);

  return {
    props: {
      initialPhoto: photo,
    },
  };
};

export default PhotoDetail;
