import { Photo } from "../types/photo";

interface GetPhotosParams {
  firebase_uid: string;
}

export const getPhotos = async (params: GetPhotosParams): Promise<Photo[]> => {
  const stringParams: Record<string, string> = {};

  if (params?.firebase_uid) {
    stringParams.firebase_uid = params.firebase_uid;
  }

  const queryParams = new URLSearchParams(stringParams).toString();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/photos?${queryParams}`
  );
  const data = await response.json();
  return data;
};
