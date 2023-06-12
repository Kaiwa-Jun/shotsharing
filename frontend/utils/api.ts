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
  photoId: number,
  idToken: string
): Promise<Comment> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/photos/${photoId}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        comment: {
          content: comment,
          photo_id: photoId,
        },
      }),
    }
  );
  console.log("idToken", idToken);

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

export const createLike = async (photoId: number, idToken: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/photos/${photoId}/likes`;
  console.log(url);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
  });
  console.log("createLikeのidToken", idToken);

  if (!response.ok) {
    throw new Error("いいねの送信に失敗しました");
  }
  return response.json();
};

export const deleteLike = async (photoId: number, idToken: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/photos/${photoId}/likes`;
  console.log(url);
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
  });
  console.log("deleteLikeのidToken", idToken);

  if (!response.ok) {
    throw new Error("いいねの削除に失敗しました");
  }
  return response.json();
};

export async function getLike(
  photoId: number,
  idToken: string
): Promise<boolean> {
  const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/photos/${photoId}/likes`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    if (!response.ok) {
      if (response.status === 404) {
        // 404エラーは、いいねが存在しないことを意味するので、falseを返します。
        return false;
      }
      // その他のエラーはエラーメッセージをスローします。
      throw new Error("Failed to fetch like");
    }
    const data = await response.json();
    return data.liked;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const setLikesToLocalStorage = (photoId: string, isLiked: boolean) => {
  localStorage.setItem(photoId, JSON.stringify(isLiked));
};

export const getLikesFromLocalStorage = (photoId: string) => {
  const isLiked = localStorage.getItem(photoId);
  return isLiked ? JSON.parse(isLiked) : false;
};
