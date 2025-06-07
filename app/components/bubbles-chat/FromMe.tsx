import { Ellipsis } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";

type ChatFromMeProps = {
  text: string;
  time: string;
  onClickEdit?: () => void;
  onClickDelete?: () => void;
};

export default function ChatFromMe({
  text,
  time,
  onClickEdit,
  onClickDelete,
}: ChatFromMeProps) {
  return (
    <div className="flex justify-end mb-3">
      <div className="w-full flex flex-col gap-1 max-w-[430px]">
        <h5 className="text-sm text-purple-500 font-semibold text-right">
          You
        </h5>
        <div className="w-full flex justify-end">
          <div className="flex gap-2 w-fit">
            <Popover>
              <PopoverTrigger asChild>
                <Ellipsis size={14} />
              </PopoverTrigger>
              <PopoverContent className="w-[126px] p-0">
                <div
                  onClick={onClickEdit}
                  className="text-base text-primary-100 cursor-pointer p-2"
                >
                  Edit
                </div>
                <hr />
                <div
                  onClick={onClickDelete}
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
  );
}
