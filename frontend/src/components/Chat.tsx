import React, { useEffect, useRef } from "react";
import ChatHeader from "./chatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./MessageSkeleton";

const Chat = ({ messages, loading, error, selectedUser, currentUser }) => {
  const messageRef = useRef(null);
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (loading) return <MessageSkeleton />;
  if (error)
    return <div className="p-4 text-red-500">Error: {error.message}</div>;

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader user={selectedUser} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isCurrentUser = msg.senderId === currentUser._id;
          const profilePic = isCurrentUser
            ? currentUser.profilePic || "avatar.png"
            : selectedUser.profilePic || "avatar.png";

          return (
            <div
              key={msg._id}
              className={`chat ${isCurrentUser ? "chat-end" : "chat-start"}`}
              ref={messageRef}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img src={profilePic} alt="profile" />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">{msg.createdAt}</time>
              </div>
              <div
                className={`chat-bubble flex flex-col ${
                  isCurrentUser
                    ? "bg-primary text-primary-content"
                    : "bg-base-200"
                }`}
              >
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="Attached content"
                    className="rounded-md mb-2 max-w-[280px] sm:max-w-xs object-cover"
                  />
                )}
                {msg.text && (
                  <p
                    className={`mt-1 ${
                      msg.image ? "pt-2 border-t border-opacity-20" : ""
                    }`}
                  >
                    {msg.text}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <MessageInput />
    </div>
  );
};

export default React.memo(Chat);
