import UserInfo from "@/components/organisms/UserInfo";

const MyCommentsPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow" style={{ minHeight: "150vh" }}>
        <UserInfo />
        <div>coming soon...</div>
      </main>
    </div>
  );
};

export default MyCommentsPage;
