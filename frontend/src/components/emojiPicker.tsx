import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface EmojiPickerProps {
  onSelect: (emoji: EmojiClickData) => void;
}

const CustomEmojiPicker = ({ onSelect }: EmojiPickerProps) => (
  <EmojiPicker
    onEmojiClick={onSelect}
    width={300}
    height={350}
    previewConfig={{ showPreview: false }}
  />
);

export default CustomEmojiPicker;
