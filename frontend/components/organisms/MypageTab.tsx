import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const MypageTab: React.FC = () => {
  const router = useRouter();
  const activeTab = router.pathname.split("/").pop() || "posts";
  const activeStyle = "border-indigo-500 text-indigo-600";
  const inactiveStyle =
    "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300";

  return (
    <div className="flex justify-center">
      <div className="w-full md:w-1/2 lg:w-1/4">
        <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
          <ul
            className="flex flex-row justify-center flex-wrap -mb-px text-sm font-medium text-center"
            id="myTab"
            role="tablist"
          >
            <li className="w-1/3 px-2" role="presentation">
              <Link href="/mypage/posts">
                <div
                  className={`inline-block p-4 border-b-2 rounded-t-lg cursor-pointer ${
                    activeTab === "posts" ? activeStyle : inactiveStyle
                  }`}
                  onClick={() => router.push("/mypage/posts")}
                >
                  投稿
                </div>
              </Link>
            </li>
            <li className="w-1/3 px-2" role="presentation">
              <Link href="/mypage/likes">
                <div
                  className={`inline-block p-4 border-b-2 rounded-t-lg cursor-pointer ${
                    activeTab === "likes" ? activeStyle : inactiveStyle
                  }`}
                  onClick={() => router.push("/mypage/likes")}
                >
                  いいね
                </div>
              </Link>
            </li>
            <li className="w-1/3 px-2" role="presentation">
              <Link href="/mypage/comments">
                <div
                  className={`inline-block p-4 border-b-2 rounded-t-lg cursor-pointer ${
                    activeTab === "comments" ? activeStyle : inactiveStyle
                  }`}
                  onClick={() => router.push("/mypage/comments")}
                >
                  コメント
                </div>
              </Link>
            </li>
          </ul>
        </div>
        <div>{/* 各タブのコンテンツは、それぞれのページで表示されます */}</div>
      </div>
    </div>
  );
};

export default MypageTab;
