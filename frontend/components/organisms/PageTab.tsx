import { useState, Suspense } from "react";
import loadable from "@loadable/component";
import RecommendList from "../RecommendList";
import { usePhotoContext } from "../../contexts/PhotoContext";

const PhotoList = loadable(() => import("../PhotoList"));

const PageTab = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { photos } = usePhotoContext();

  return (
    <>
      <div className="flex justify-center">
        <div className="w-full md:w-1/2">
          <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
            <ul
              className="flex flex-wrap -mb-px text-sm font-medium text-center"
              id="myTab"
              role="tablist"
            >
              <li className="w-1/2" role="presentation">
                <button
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    activeTab === "profile"
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                  }`}
                  id="profile-tab"
                  type="button"
                  role="tab"
                  aria-controls="profile"
                  aria-selected={activeTab === "profile"}
                  onClick={() => setActiveTab("profile")}
                >
                  新着
                </button>
              </li>
              <li className="w-1/2" role="presentation">
                <button
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    activeTab === "dashboard"
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                  }`}
                  id="dashboard-tab"
                  type="button"
                  role="tab"
                  aria-controls="dashboard"
                  aria-selected={activeTab === "dashboard"}
                  onClick={() => setActiveTab("dashboard")}
                >
                  来月のオススメ
                </button>
              </li>
            </ul>
          </div>
          <div>
            <div
              className={`${
                activeTab === "profile" ? "" : "hidden"
              } p-4 rounded-lg bg-gray-50 dark:bg-gray-800`}
              id="profile"
              role="tabpanel"
              aria-labelledby="profile-tab"
            >
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <Suspense fallback={<div>Loading...</div>}>
                  <PhotoList photos={photos} />
                </Suspense>
              </div>
            </div>
            <div
              className={`${
                activeTab === "dashboard" ? "" : "hidden"
              } p-4 rounded-lg bg-gray-50 dark:bg-gray-800`}
              id="dashboard"
              role="tabpanel"
              aria-labelledby="dashboard-tab"
            >
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <RecommendList photos={photos} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageTab;
