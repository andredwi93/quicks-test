import { format, parseISO } from "date-fns";
import { Search, User } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { truncate } from "~/helpers/textConfig";
import ChatLoading from "../ChatLoading";
import MultipleUserChat from "./chat/MultipleUserChat";
import SupportChat from "./chat/SupportChat";

type ActiveChat = {
  id: number;
  name: string;
  message: string;
};

type ChatComponentProps = {
  messageType?: {
    id: number;
    isGroup: boolean;
    isSupport: boolean;
    isRead: boolean;
    groupTitle: string;
    activeChat: ActiveChat;
    createdAt: string;
  };
};

export default function ChatComponent({ messageType }: ChatComponentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [allMessages, setAllMessages] = useState<(typeof messageType)[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<
    (typeof messageType)[]
  >([]);
  const [openMultiMessage, setOpenMultiMessage] = useState(false);
  const [onSupportMessage, setOnSupportMessage] = useState(false);

  const getUserMessages = async () => {
    setIsLoading(true);
    try {
      const getUsers = await fetch(
        "https://mocki.io/v1/c883700a-0c5f-46ee-853a-0169f30df9f0"
      );

      const users = await getUsers.json();

      setAllMessages(users?.data);
      setFilteredMessages(users?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserMessages();
  }, []);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const keyword = e.target.value.toLowerCase();

      if (!keyword) {
        setFilteredMessages(allMessages);
        return;
      }

      const filtered = allMessages.filter((msg) => {
        if (msg?.groupTitle.length) {
          return msg?.groupTitle.toLowerCase().includes(keyword);
        } else {
          return msg?.activeChat.name.toLowerCase().includes(keyword);
        }
      });
      setFilteredMessages(filtered);
    },
    [allMessages]
  );

  return openMultiMessage ? (
    <MultipleUserChat onClose={() => setOpenMultiMessage(false)} />
  ) : onSupportMessage ? (
    <SupportChat onClose={() => setOnSupportMessage(false)} />
  ) : (
    <div className="absolute bottom-24 right-0 md:right-8 w-[320px] md:w-[734px] h-[500px] bg-white rounded-xl overflow-x-hidden overflow-y-scroll">
      {isLoading && <ChatLoading title="Loading Chats" />}
      <div className="px-8 my-5">
        <div className="w-full px-4 py-2 rounded-lg border border-black flex items-center gap-4">
          <input
            type="text"
            placeholder="Search"
            className="w-full placeholder:text-primary-300 text-black text-base outline-0 bg-white"
            onChange={handleSearch}
          />
          <Search size={16} />
        </div>

        {filteredMessages.length > 0 ? (
          filteredMessages.map((msg, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row gap-4 border-b py-4 last:border-0 cursor-pointer"
              onClick={() => {
                if (msg?.isGroup) {
                  setOpenMultiMessage(true);
                } else {
                  setOnSupportMessage(true);
                }
              }}
            >
              {msg?.isGroup ? (
                <div className="w-[51px] h-[34px] relative flex items-end justify-end">
                  <div className="w-[34px] h-[34px] z-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <User color="white" size={16} />
                  </div>
                  <div className="w-[34px] h-[34px] absolute top-0 left-0 rounded-full bg-primary-200 flex items-center justify-center">
                    <User color="white" size={16} />
                  </div>
                </div>
              ) : (
                <div className="w-[51px] h-[34px] relative flex items-center justify-center">
                  <div className="w-[34px] h-[34px] rounded-full bg-primary-100 text-white flex items-center justify-center">
                    {msg?.activeChat.name[0]}
                  </div>
                </div>
              )}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row text-sm gap-4">
                  <p className="text-primary-100 font-semibold capitalize">
                    {msg?.groupTitle.length
                      ? msg?.groupTitle
                      : msg?.activeChat.name}
                  </p>
                  <span className="text-primary-400 font-semibold">
                    {msg?.isRead
                      ? format(parseISO(msg?.createdAt), "MMMM d, yyyy HH:mm")
                      : format(parseISO(msg?.createdAt!), "dd/MM/yyyy HH:mm")}
                  </span>
                </div>
                <p className="font-semibold text-base text-primary-400">
                  {msg?.activeChat.name}:
                </p>
                <div className="flex justify-between">
                  <p className="text-primary-400 text-sm">
                    {truncate(msg?.activeChat.message ?? "", 50)}
                  </p>
                  {!msg?.isRead && (
                    <div className="w-[10px] h-[10px] rounded-full bg-red"></div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-primary-400 text-center mt-20">
            {!isLoading && "No messages found"}
          </p>
        )}
      </div>
    </div>
  );
}
