import { useEffect, useState } from "react";
import { Comment } from "../../types/comment";
import { Photo } from "../../types/photo";
import { getMyComments, getPhotoById } from "../../utils/api";
import Image from "next/image";
import { useAuth } from "../../contexts/UserContext";
import Link from "next/link";

interface CommentWithPhoto extends Comment {
  photo: Photo | null;
}

interface GroupedComments {
  photo: Photo | null;
  comments: CommentWithPhoto[];
}

// Helper function to group comments by their associated photo
const groupCommentsByPhoto = (
  comments: CommentWithPhoto[]
): GroupedComments[] => {
  const grouped: { [key: string]: GroupedComments } = {};

  for (const comment of comments) {
    const photoId = comment.photo_id.toString();
    if (grouped[photoId]) {
      grouped[photoId].comments.push(comment);
    } else {
      grouped[photoId] = {
        photo: comment.photo,
        comments: [comment],
      };
    }
  }

  return Object.values(grouped);
};

const MyComments: React.FC = () => {
  const [groupedComments, setGroupedComments] = useState<GroupedComments[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      if (user && user.idToken) {
        const idToken = user.idToken;
        const userId = user.firebase_uid;
        const myComments = await getMyComments(idToken, userId);

        // Fetch related photos for each comment
        const commentsWithPhotos: CommentWithPhoto[] = [];
        for (const comment of myComments) {
          const photo = await getPhotoById(comment.photo_id.toString());
          commentsWithPhotos.push({ ...comment, photo });
        }

        setGroupedComments(groupCommentsByPhoto(commentsWithPhotos));
      }
    };

    fetchComments();
  }, [user]); // userを依存性配列に追加

  return (
    <div className="sm:max-w-full lg:max-w-1/3 mx-auto p-5 mb-4 border border-gray-100 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
      {groupedComments.map((group, index) => (
        // Added mt-5 to add vertical spacing between posts
        <div key={index} className="mt-5">
          <time className="text-lg font-semibold text-gray-900 dark:text-white">
            {group.photo
              ? new Date(group.photo.created_at).toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
              : "Unknown Date"}
          </time>

          {group.photo ? (
            <div className="w-full">
              <Link href={`/photo/${group.photo.id}`}>
                <Image
                  className="h-auto mt-3 mb-3 rounded cursor-pointer"
                  src={group.photo.file_url}
                  alt="Grouped photo"
                  layout="responsive"
                  width={1000}
                  height={600}
                />
              </Link>
            </div>
          ) : (
            <p>No photo available</p>
          )}

          <ol className="mt-3 divide-y divide-gray-200 dark:divide-gray-700">
            {group.comments.map((comment, index) => (
              <li key={index}>
                <div className="items-center block p-3 flex hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Image
                    className="w-12 h-12 mb-3 mr-3 rounded-full sm:mb-0"
                    src={
                      comment.user && comment.user.avatar_url
                        ? comment.user.avatar_url
                        : "/path/to/default/avatar.png"
                    }
                    alt="User avatar"
                    width={48}
                    height={48}
                  />
                  <div className="text-gray-600 dark:text-gray-400">
                    <div className="text-base font-normal">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {comment.user ? comment.user.display_name : "Anonymous"}
                      </span>
                    </div>
                    <div className="text-sm font-normal">{comment.content}</div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
};

export default MyComments;
