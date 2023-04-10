import MyComments from "@/components/organisms/MyComments";
import MypageTab from "@/components/organisms/MypageTab";
import UserInfo from "@/components/organisms/UserInfo";

const MyCommentsPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow" style={{ minHeight: "150vh" }}>
        <UserInfo />
        <MypageTab />
        <MyComments />
      </main>
    </div>
  );
};

export default MyCommentsPage;
