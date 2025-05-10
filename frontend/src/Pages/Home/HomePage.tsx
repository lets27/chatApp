import useUserContext from "../../context/useUser";

import ChatPlaceHolder from "../../components/ChatPlaceHolder";
import { Loader } from "lucide-react";
import UsersSideBar from "../../components/sideBar";
import { useSelectedUser } from "../../context/useSelectedUser";
import ChatContainer from "../../components/chatContainer";

const HomePage = () => {
  const { loading } = useUserContext();
  const { selectedUser } = useSelectedUser();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-base-200">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-centered justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <UsersSideBar />
            {selectedUser ? <ChatContainer /> : <ChatPlaceHolder />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
