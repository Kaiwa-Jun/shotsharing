import firebase from "./firebaseConfig";

export const getPostsByUserId = async (userId: string) => {
  try {
    const querySnapshot = await firebase
      .firestore()
      .collection("posts")
      .where("user_id", "==", userId)
      .get();

    const posts = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });

    return posts;
  } catch (error) {
    console.error(error);
    throw new Error("投稿の取得に失敗しました");
  }
};
