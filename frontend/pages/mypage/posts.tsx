import MyPhotos from "@/components/organisms/MyPhotos";
import MypageTab from "@/components/organisms/MypageTab";
import UserInfo from "@/components/organisms/UserInfo";

const MyPostsPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen mt-20">
      <main className="flex-grow" style={{ minHeight: "150vh" }}>
        <UserInfo />
        <MypageTab />
        <MyPhotos />
      </main>
    </div>
  );
};

export default MyPostsPage;
