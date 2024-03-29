import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getPhotoById, getPhotosByJapaneseName } from "../../utils/api";
import { Photo } from "../../types/photo";
import HeroSection from "../../components/organisms/HeroSection";
import Image from "next/image";
import { NextSeo } from "next-seo";
import RecommendPhotos from "@/components/organisms/RecommendPhotos";

interface PhotoDetailProps {
  initialPhoto: Photo | null;
  initialRecommendedPhotos: Photo[];
}

const toFraction = (decimal: number) => {
  if (decimal == null) {
    // decimalがnullまたはundefinedの場合、何らかのデフォルト値を返す
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const id = context.params?.id;

    if (!id || typeof id !== "string") {
      return { notFound: true };
    }

    const photo = await getPhotoById(id);

    if (!photo) {
      return { notFound: true };
    }

    let recommendedPhotos: Photo[] = [];

    try {
      recommendedPhotos = await getPhotosByJapaneseName(photo.japanese_name);
      console.log(
        "recommendedPhotos from getServerSideProps",
        recommendedPhotos
      );
    } catch (error) {
      console.error("Failed to get recommended photos:", error);
    }

    if (!recommendedPhotos) {
      recommendedPhotos = []; // undefinedだった場合に空配列を代入
    }

    console.log("photo from getServerSideProps", photo);

    return {
      props: {
        initialPhoto: photo,
        initialRecommendedPhotos: recommendedPhotos,
      },
    };
  } catch (error) {
    console.error("getServerSideProps error", error);
    return { props: { initialPhoto: null, initialRecommendedPhotos: [] } };
  }
};

const PhotoDetail: React.FC<PhotoDetailProps> = ({
  initialPhoto,
  initialRecommendedPhotos,
}) => {
  const [photo, setPhoto] = useState<Photo | null>(initialPhoto);
  const [recommendedPhotos, setRecommendedPhotos] = useState<Photo[]>(
    initialRecommendedPhotos
  );
  const [imageWidth, setImageWidth] = useState<number>(0);
  const fixedHeight = 300; // 画像の高さを固定
  const router = useRouter();
  const { id } = router.query;
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const aspectRatio =
    photo && photo.height && photo.width ? photo.height / photo.width : 1;

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      setImageWidth(screenWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [photo, fixedHeight]);

  useEffect(() => {
    console.log("initialPhoto:", initialPhoto);
    console.log("initialPhoto file_url:", initialPhoto?.file_url);

    if (!initialPhoto && id) {
      getPhotoById(id).then((photo) => {
        if (photo) {
          console.log("file_url:", photo.file_url);
        }
        setPhoto(photo);
      });
    }
  }, [id, initialPhoto]);

  useEffect(() => {
    if (photo && photo.user && photo.user.avatar_url) {
      setAvatarUrl(photo.user.avatar_url);
    }
  }, [photo]);

  useEffect(() => {
    console.log("initialRecommendedPhotos:", initialRecommendedPhotos);
  }, [initialRecommendedPhotos]);

  if (!photo) {
    return <div>Loading...</div>;
  }

  console.log("presignedURL:", photo.file_url);
  console.log("photo.user:", photo.user);
  console.log("photo.user.avatar_url:", photo.user?.avatar_url);

  return (
    <>
      <NextSeo
        title={`ShotSharing - ${
          photo.user ? photo.user.display_name : "User's"
        } Photo`}
        description={`View this photo taken by ${
          photo.user ? photo.user.display_name : "User"
        }`}
        openGraph={{
          url: `https://shotsharing.vercel.app/photo/${photo.id}`,
          title: `ShotSharing - ${
            photo.user ? photo.user.display_name : "User's"
          } Photo`,
          description: `View this photo taken by ${
            photo.user ? photo.user.display_name : "User"
          }`,
          images: [
            {
              url: photo.file_url,
              width: 800,
              height: 600,
              alt: `ShotSharing - ${
                photo.user ? photo.user.display_name : "User's"
              } Photo`,
            },
          ],
        }}
        twitter={{
          cardType: "summary_large_image",
        }}
      />
      <HeroSection />
      <div className="my-7">
        <div className="flex items-center justify-center my-5">
          <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
            <img
              src={avatarUrl ? avatarUrl : "/path/to/default/avatar.png"}
              alt="User avatar"
              width="500"
              height="500"
            />
          </div>
          <div className="py-1 ml-6 text-2xl">
            <p className="text-gray-900">
              {photo.user ? photo.user.display_name : "Loading..."}
            </p>
          </div>
        </div>
        <div className="flex flex-row-reverse justify-center mx-auto max-w-screen-lg">
          <div className="pl-4 py-4 w-full sm:w-1/2">
            <p className="text-gray-900">カメラ : {photo.camera_model}</p>
            <p className="text-gray-900">ISO : {photo.iso}</p>
            <p className="text-gray-900">F値 : {photo.f_value}</p>
            <p className="text-gray-900">
              シャッタースピード :{" "}
              {photo.exposure_time < 1
                ? toFraction(photo.exposure_time)
                : photo.exposure_time}
            </p>
            <p className="text-gray-900">
              撮影日 :{" "}
              {new Date(photo.taken_at).toLocaleString("ja-JP", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="pl-4 w-full sm:w-1/2">
            <div
              className="relative"
              style={{ width: `${100 * aspectRatio}%`, height: fixedHeight }}
            >
              <Image
                src={photo.image_url}
                alt="Uploaded photo"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
        </div>
      </div>
      <RecommendPhotos photos={recommendedPhotos} />
    </>
  );
};

export default PhotoDetail;
