import { useRef, useState } from "react";
import { useSelectedUser } from "../context/useSelectedUser";
import useSendMessages from "../Hooks/useSendMessages";
import { Image, Loader, Send, X } from "lucide-react";

import EmojiPicker from "./emojiPicker";

const MessageInput = () => {
  const { selectedUser } = useSelectedUser();
  const { sendMessages, error, sending } = useSendMessages();
  const [messageData, setMessageData] = useState({ message: "" });
  const [fileData, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerPosition, setPickerPosition] = useState({ bottom: 0, right: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const addEmoji = (emoji: EmojiClickData) => {
    setMessageData((prev) => ({
      ...prev,
      message: prev.message + emoji.emoji,
    }));
    setShowPicker(false); // Close picker after selection
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMessageData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append("message", messageData.message);
    if (fileData) {
      submitData.append("file", fileData);
    }
    submitData.append("receiverId", selectedUser._id);
    console.log("submitData:", submitData);
    await sendMessages(submitData);

    // Reset form
    setMessageData({ message: "" });
    setFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (sending) {
    return <Loader className="size-10 animate-spin" />;
  }

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            name="message"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={messageData.message}
            onChange={handleChange}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setPickerPosition({
                bottom: window.innerHeight - rect.top + 10,
                right: window.innerWidth - rect.right,
              });
              setShowPicker((prev) => !prev);
            }}
            className="p-2 hover:bg-gray-200 rounded-full"
          >
            😊
          </button>
          {showPicker && (
            <div
              style={{
                position: "fixed",
                bottom: `${pickerPosition.bottom}px`,
                right: `${pickerPosition.right}px`,
                zIndex: 1000,
              }}
            >
              <EmojiPicker onSelect={addEmoji} />
            </div>
          )}
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${
              imagePreview ? "text-emerald-500" : "text-zinc-400"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!messageData.message.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>

      {error && (
        <p className="text-red-500 text-sm mt-2">
          {error.message || "Something went wrong!"}
        </p>
      )}
    </div>
  );
};

export default MessageInput;
