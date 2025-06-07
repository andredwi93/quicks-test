import { Ellipsis } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";

type ChatFromOtherProps = {
  name: string;
  text: string;
  time: string;
  textColor: string;
  bgColor: string;
  isOption?: boolean;
  onShare?: () => void;
  onReply?: () => void;
};

export default function ChatFromOther({
  name,
  text,
  time,
  textColor,
  bgColor,
  isOption = true,
  onShare,
  onReply,
}: ChatFromOtherProps) {
  return (
    <div className="flex mb-3">
      <div className="w-full flex flex-col gap-1 max-w-[540px]">
        <h5 className={`text-sm ${textColor} font-semibold`}>{name}</h5>
        <div className="flex gap-2">
          <div
            className={`w-fit rounded-[10px] flex flex-col gap-2 p-[10px] ${bgColor}`}
          >
            <p className="text-sm font-medium text-primary-400">{text}</p>
            <p className="text-sm font-medium text-primary-400">{time}</p>
          </div>
          {isOption && (
            <div className="w-fit">
              <Popover>
                <PopoverTrigger asChild>
                  <Ellipsis size={14} />
                </PopoverTrigger>
                <PopoverContent className="w-[126px] p-0">
                  <div
                    onClick={onShare}
                    className="text-base text-primary-100 cursor-pointer p-2"
                  >
                    Edit
                  </div>
                  <hr />
                  <div
                    onClick={onReply}
                    className="text-base text-red cursor-pointer p-2"
                  >
                    Delete
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
