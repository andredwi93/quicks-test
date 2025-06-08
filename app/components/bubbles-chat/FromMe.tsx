import { Ellipsis } from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";

type ChatFromMeProps = {
  text: string;
  textReply?: string;
  time: string;
  isReply?: boolean;
  onClickEdit?: () => void;
  onClickDelete?: () => void;
};

export default function ChatFromMe({
  text,
  textReply,
  time,
  isReply,
  onClickEdit,
  onClickDelete,
}: ChatFromMeProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-end mb-3">
      <div className="w-full flex flex-col gap-1 max-w-[430px]">
        <h5 className="text-sm text-purple-500 font-semibold text-right">
          You
        </h5>
        <div className="w-full flex justify-end">
          <div className="flex flex-col w-fit">
            {isReply && (
              <div className="bg-[#F8F8F8] mb-2 rounded-[10px] flex-1 flex flex-col gap-2 p-[10px]">
                <p className="text-sm font-medium text-primary-400">
                  {textReply}
                </p>
              </div>
            )}
            <div className="flex gap-2 w-fit self-end">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild className="cursor-pointer">
                  <Ellipsis size={14} />
                </PopoverTrigger>
                <PopoverContent className="w-[126px] p-0">
                  <div
                    onClick={() => {
                      setOpen(false);
                      onClickEdit?.();
                    }}
                    className="text-base text-primary-100 cursor-pointer p-2"
                  >
                    Edit
                  </div>
                  <hr />
                  <div
                    onClick={() => {
                      setOpen(false);
                      onClickDelete?.();
                    }}
                    className="text-base text-red cursor-pointer p-2"
                  >
                    Delete
                  </div>
                </PopoverContent>
              </Popover>
              <div className="bg-purple-300 rounded-[10px] flex-1 flex flex-col gap-2 p-[10px]">
                <p className="text-sm font-medium text-primary-400">{text}</p>
                <p className="text-sm font-medium text-primary-400">{time}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
