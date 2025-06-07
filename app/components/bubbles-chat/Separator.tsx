import { ArrowDown } from "lucide-react";

type SeparatorProps = {
  text: string;
  isNewMessage?: boolean;
};

export default function Separator({ text, isNewMessage }: SeparatorProps) {
  return (
    <div className="flex items-center justify-between gap-8 my-3">
      <div
        className={`flex-1 h-[1px] ${
          isNewMessage ? "bg-red" : "bg-primary-400"
        }`}
      ></div>
      <div className="flex items-center gap-1">
        <div
          className={`text-base ${
            isNewMessage ? "text-red" : "text-primary-400"
          } font-semibold`}
        >
          {text}
        </div>
        {isNewMessage && <ArrowDown size={12} color="#F2F2F2" />}
      </div>
      <div
        className={`flex-1 h-[1px] ${
          isNewMessage ? "bg-red" : "bg-primary-400"
        }`}
      ></div>
    </div>
  );
}
