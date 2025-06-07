import { Ellipsis } from "lucide-react";

type ChatFromMeProps = {
  text: string;
  time: string;
};

export default function ChatFromMe({ text, time }: ChatFromMeProps) {
  return (
    <div className="flex justify-end mb-3">
      <div className="w-full flex flex-col gap-1 max-w-[430px]">
        <h5 className="text-sm text-purple-500 font-semibold text-right">
          You
        </h5>
        <div className="flex gap-2 justify-end">
          <Ellipsis size={14} />
          <div className="bg-purple-300 rounded-[10px] flex flex-col gap-2 p-[10px]">
            <p className="text-sm font-medium text-primary-400">{text}</p>
            <p className="text-sm font-medium text-primary-400">{time}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
