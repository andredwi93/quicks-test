import { Search, User } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { truncate } from "~/helpers/textConfig";
import ChatLoading from "../ChatLoading";

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

  const [search, setSearch] = useState("");

  const observerRef = useRef<HTMLDivElement | null>(null);

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

      const combined = posts.map((post: any, index: number) => {
        const user = users.find((u: any) => u.id === post.userId);
        return {
          id: post.id,
          title: post.title,
          body: post.body,
          sender: user?.name || "Unknown Sender",
          date: new Date(Date.now() - index * 3600000).toLocaleString(),
        };
      });

      setAllMessages(combined);
      setFilteredMessages(combined);
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
      setSearch(keyword);

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

  return (
    <div className="absolute bottom-24 right-8 w-[734px] h-[500px] bg-white py-5 px-8 rounded-xl overflow-x-hidden overflow-y-scroll">
      <div className="w-full px-4 py-2 rounded-lg border border-black flex items-center gap-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full placeholder:text-primary-300 text-black text-base outline-0"
          onChange={handleSearch}
        />
        <Search size={16} />
      </div>
      {isLoading && <ChatLoading />}
      {filteredMessages.length > 0 ? (
        filteredMessages.map((msg, index) => (
          <div key={index} className="flex gap-4 border-b py-4 last:border-0">
            {index < 3 ? (
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
              <div className="flex text-sm gap-4">
                <p className="text-primary-100 font-semibold capitalize">
                  {msg?.title}
                </p>
                <span className="text-primary-400 font-semibold">
                  {msg?.date}
                </span>
              </div>
              <p className="font-semibold text-base text-primary-400">
                {msg?.sender}:
              </p>
              <p className="text-primary-400 text-sm">
                {truncate(msg?.body ?? "", 30)}
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
  );
}
