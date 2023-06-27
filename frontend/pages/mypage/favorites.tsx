import MyFavorites from "@/components/organisms/MyFavorites";
import MypageTab from "@/components/organisms/MypageTab";
import UserInfo from "@/components/organisms/UserInfo";

const MyFavoritesPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen mt-20">
      <main className="flex-grow" style={{ minHeight: "150vh" }}>
        <UserInfo />
        <MypageTab />
        <MyFavorites />
      </main>
    </div>
  );
};

export default MyFavoritesPage;
