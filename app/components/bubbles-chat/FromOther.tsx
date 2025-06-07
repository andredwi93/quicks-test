import { Ellipsis } from "lucide-react";

type ChatFromOtherProps = {
  name: string;
  text: string;
  time: string;
  textColor: string;
  bgColor: string;
};

export default function ChatFromOther({
  name,
  text,
  time,
  textColor,
  bgColor,
}: ChatFromOtherProps) {
  return (
    <div className="flex mb-3">
      <div className="w-full flex flex-col gap-1 max-w-[540px]">
        <h5 className={`text-sm ${textColor} font-semibold`}>{name}</h5>
        <div className="flex gap-2">
          <div
            className={`rounded-[10px] flex flex-col gap-2 p-[10px] ${bgColor}`}
          >
            <p className="text-sm font-medium text-primary-400">{text}</p>
            <p className="text-sm font-medium text-primary-400">{time}</p>
          </div>
          <Ellipsis size={14} />
        </div>
      </div>
    </div>
  );
}
