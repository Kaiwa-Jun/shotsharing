const PageButton = () => {
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
                  className="inline-block p-4 rounded-t-lgborder-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                  id="profile-tab"
                  type="button"
                  role="tab"
                >
                  新着
                </button>
              </li>
              <li className="w-1/2" role="presentation">
                <button
                  className="inline-block p-4 rounded-t-lg border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                  id="dashboard-tab"
                  type="button"
                  role="tab"
                >
                  来月のオススメ
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageButton;
