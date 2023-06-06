import { Photo } from "../types/photo";
import { Comment } from "../types/comment";
import axios from "axios";

interface GetPhotosParams {
  firebase_uid: string;
}

export async function getPhotos({
  firebase_uid,
  all_users,
}: {
  firebase_uid?: string;
  all_users?: boolean;
}): Promise<Photo[]> {
  let url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/photos`;

  if (firebase_uid) {
    url += `?firebase_uid=${firebase_uid}`;
  } else if (all_users) {
    url += `?all_users=true`;
  }

  const response = await fetch(url);
  console.log("Response:", response);
  if (!response.ok) {
    throw new Error("Failed to fetch photos");
  }
  return await response.json();
}

export async function getPhotoById(
  id: string | string[]
): Promise<Photo | null> {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/photos/${id}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const postComment = async (
  comment: string,
  photoId: number
): Promise<Comment> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/photos/${photoId}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment: {
          content: comment,
          photo_id: photoId,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error("コメントの投稿に失敗しました");
  }

  const data = await response.json();
  return data;
};

export async function getComments(photoId: number): Promise<Comment[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/photos/${photoId}/comments`
  );
  if (!response.ok) {
    throw new Error("コメントの取得に失敗しました");
  }
  return await response.json();
}
