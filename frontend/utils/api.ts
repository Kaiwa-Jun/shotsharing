import { Photo } from "../types/photo";
import { Comment } from "../types/comment";
import { SearchResult } from "../types/searchResult";
import axios from "axios";
import { User } from "../types/user";
import firebase from "firebase/compat";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";

interface GetPhotosParams {
  firebase_uid: string;
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function getPhotos({
  firebase_uid,
  all_users,
}: {
  firebase_uid?: string;
  all_users?: boolean;
}): Promise<Photo[]> {
  let url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/photos`;

  // パラメータがセットされている場合のみURLに追加
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

  // データをロギング
  const data = await response.json();
  console.log("Fetched data:", data);

  return data;
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
  // photoIdのチェック
  if (typeof photoId !== "number") {
    throw new Error(`Invalid photoId: ${photoId}`);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/photos/${photoId}/comments`
  );

  if (!response.ok) {
    throw new Error("コメントの取得に失敗しました");
  }
  return await response.json();
}

export async function getMyComments(
  idToken: string,
  userId: string
): Promise<Comment[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/users/${userId}/comments`,
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("コメントの取得に失敗しました");
  }

  const data = await response.json();
  return data;
}

export async function getUserComments(userId: string): Promise<Comment[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/users/${userId}/comments`
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

export async function getLikesCount(
  photoId: number,
  idToken: string
): Promise<number> {
  const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/photos/${photoId}/likes`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch likes count");
    }
    const data = await response.json();
    // console.log(`Likes count for photoId ${photoId}: ${data.likes_count}`);
    return data.likes_count;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getUserByFirebaseUid = async (firebase_uid: string) => {
  console.log("getUserByFirebaseUid called with firebase_uid:", firebase_uid);
  try {
    const userDoc = await getDoc(doc(db, "users", firebase_uid));

    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    const user: User = userDoc.data() as User;
    console.log("getUserByFirebaseUid returning user:", user);
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getLikedPhotos = async (firebase_uid: string) => {
  console.log("getLikedPhotos called with firebase_uid:", firebase_uid);
  const user = await getUserByFirebaseUid(firebase_uid);
  console.log("User returned by getUserByFirebaseUid:", user);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/users/${user.firebase_uid}/likes`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch liked photos");
  }
  const data = await response.json();
  console.log("getLikedPhotos returning photos:", data.photos);
  return data.photos;
};

export async function fetchSearchResults(
  keyword: string
): Promise<SearchResult[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/search?keyword=${keyword}`
  );
  const data = await response.json();
  return data;
}
