import { createContext, useContext } from "react";

interface MessageContextType {
  messages: any[];
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
}

// Create the context with the correct type
export const MessageContext = createContext<MessageContextType | null>(null);

const useMessageContext = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessageContext must be used inside a MessageProvider");
  }
  return context;
};

export default useMessageContext;
