import { Search, User } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { truncate } from "~/helpers/textConfig";
import ChatLoading from "../ChatLoading";
import MultipleUserChat from "./chat/MultipleUserChat";
import { v4 as uuid } from "uuid";
import SupportChat from "./chat/SupportChat";

type ChatComponentProps = {
  messageType?: {
    id: number;
    sender: string;
    message: string;
    date: string;
    title: string;
    body: string;
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
      const usersRes = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      const postsRes = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );

      const users = await usersRes.json();
      const posts = await postsRes.json();

      const combined = posts.slice(0, 3).map((post: any, index: number) => {
        const user = users.find((u: any) => u.id === post.userId);
        return {
          id: post.id,
          title: post.title,
          body: post.body,
          sender: user?.name || "Unknown Sender",
          date: new Date(Date.now() - index * 3600000).toLocaleString(),
        };
      });

      setAllMessages([
        ...combined,
        {
          id: uuid(),
          title: "FastVisa Support",
          body: "Hey there! Welcome to your inbox.",
          sender: "FastVisa Support",
          date: new Date(Date.now() - 3 * 3600000).toLocaleString(),
        },
      ]);
      setFilteredMessages([
        ...combined,
        {
          id: uuid(),
          title: "FastVisa Support",
          body: "Hey there! Welcome to your inbox.",
          sender: "FastVisa Support",
          date: new Date(Date.now() - 3 * 3600000).toLocaleString(),
        },
      ]);
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

      const filtered = allMessages.filter((msg) =>
        msg?.title.toLowerCase().includes(keyword)
      );
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
                if (!msg?.sender.includes("FastVisa")) {
                  setOpenMultiMessage(true);
                } else {
                  setOnSupportMessage(true);
                }
              }}
            >
              {!msg?.sender.includes("FastVisa") ? (
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
                    {msg?.sender[0]}
                  </div>
                </div>
              )}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row text-sm gap-4">
                  <p className="text-primary-100 font-semibold capitalize">
                    {msg?.title}
                  </p>
                  <span className="text-primary-400 font-semibold">
                    {msg?.date}
                  </span>
                </div>
                {!msg?.sender.includes("FastVisa") ? (
                  <p className="font-semibold text-base text-primary-400">
                    {msg?.sender}:
                  </p>
                ) : null}
                <p className="text-primary-400 text-sm">
                  {truncate(msg?.body ?? "", 50)}
                </p>
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
