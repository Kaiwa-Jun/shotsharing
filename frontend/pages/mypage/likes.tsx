import MyLikes from "@/components/organisms/MyLikes";
import MypageTab from "@/components/organisms/MypageTab";
import UserInfo from "@/components/organisms/UserInfo";

const MyLikesPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen mt-20">
      <main className="flex-grow" style={{ minHeight: "150vh" }}>
        <UserInfo />
        <MypageTab />
        <MyLikes />
      </main>
    </div>
  );
};

export default MyLikesPage;
