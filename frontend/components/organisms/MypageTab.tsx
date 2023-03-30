import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import MyPhotos from "./MyPhotos";
import MyLikes from "./MyLikes";
import MyComments from "./MyComments";
import MyFavorites from "./MyFavorites";
import { useRouter } from "next/router";

const MypageTabContent = () => {
  const router = useRouter();
  const activeTab = router.pathname.split("/").pop() || "posts";
  const location = useLocation();
  const activeStyle = "border-indigo-500 text-indigo-600";
  const inactiveStyle =
    "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300";

  return (
    <div className="flex justify-center">
      <div className="w-full md:w-1/4">
        <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
          <ul
            className="flex flex-wrap -mb-px text-sm font-medium text-center"
            id="myTab"
            role="tablist"
          >
            <li className="w-1/4" role="presentation">
              <Link
                to="/mypage/posts"
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  activeTab === "posts" ? activeStyle : inactiveStyle
                }`}
              >
                投稿
              </Link>
            </li>
            <li className="w-1/4" role="presentation">
              <Link
                to="/mypage/likes"
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  activeTab === "likes" ? activeStyle : inactiveStyle
                }`}
              >
                いいね
              </Link>
            </li>
            <li className="w-1/4" role="presentation">
              <Link
                to="/mypage/comments"
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  activeTab === "comments" ? activeStyle : inactiveStyle
                }`}
              >
                コメント
              </Link>
            </li>
            <li className="w-1/4" role="presentation">
              <Link
                to="/mypage/favorites"
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  activeTab === "favorites" ? activeStyle : inactiveStyle
                }`}
              >
                お気に入り
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <Routes>
            <Route path="/mypage/posts" element={<MyPhotos />} />
            <Route path="/mypage/likes" element={<MyLikes />} />
            <Route path="/mypage/comments" element={<MyComments />} />
            <Route path="/mypage/favorites" element={<MyFavorites />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const MypageTab = () => {
  return (
    <>
      <Router>
        <MypageTabContent />
      </Router>
    </>
  );
};

export default MypageTab;
