import { Ellipsis } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { toast } from "sonner";
import ChatLoading from "../ChatLoading";

type ChatFromOtherProps = {
  name: string;
  text: string;
  time: string;
  textColor: string;
  bgColor: string;
  isOption?: boolean;
  onReply?: () => void;
};

export default function ChatFromOther({
  name,
  text,
  time,
  textColor,
  bgColor,
  isOption = true,
  onReply,
}: ChatFromOtherProps) {
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const getUserMessages = async () => {
    setIsLoading(true);
    try {
      const usersRes = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );

      const users = await usersRes.json();
      setUsers(users);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

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
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild className="cursor-pointer">
                  <Ellipsis size={14} />
                </PopoverTrigger>
                <PopoverContent className="w-[126px] p-0">
                  <div
                    onClick={() => {
                      setOpen(false);
                      setOpenDialog(true);
                      getUserMessages();
                    }}
                    className="text-base text-primary-100 cursor-pointer p-2"
                  >
                    Share
                  </div>
                  <hr />
                  <div
                    onClick={() => {
                      setOpen(false);
                      onReply?.();
                    }}
                    className="text-base text-primary-100 cursor-pointer p-2"
                  >
                    Reply
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </div>
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Share to...</AlertDialogTitle>
            <AlertDialogDescription>
              {isLoading ? (
                <ChatLoading title="Loading..." />
              ) : (
                <div>
                  <ul>
                    {users.map((user: any, index) => (
                      <li
                        key={index}
                        className="border p-2 rounded-sm mb-1"
                        onClick={() => {
                          toast(`Chat share to ${user.name}`);
                          setOpenDialog(false);
                        }}
                      >
                        {user.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
