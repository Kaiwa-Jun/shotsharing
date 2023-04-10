import { NextApiRequest, NextApiResponse } from "next";
import { getUserFromIdToken } from "@/lib/auth";
import { getPostsByUserId } from "@/lib/posts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, headers } = req;

  if (method === "GET") {
    try {
      const idToken = headers.authorization?.replace("Bearer ", "");

      if (!idToken) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const user = await getUserFromIdToken(idToken);

      if (!user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const posts = await getPostsByUserId(user.firebase_uid);
      res.status(200).json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
