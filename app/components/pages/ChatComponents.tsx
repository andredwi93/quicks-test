import { ArrowLeft, Ellipsis, Search, User, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { truncate } from "~/helpers/textConfig";
import ChatLoading from "../ChatLoading";
import ChatFromMe from "../bubbles-chat/FromMe";
import Separator from "../bubbles-chat/Separator";
import ChatFromOther from "../bubbles-chat/FromOther";
import { Button } from "../ui/button";
import { format } from "date-fns";

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

  const [chatMessage, setChatMessage] = useState("");
  const [errEmptyMessage, setErrEmptyMessage] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [isLoading]);

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

  const [dataMessage, setDataMessage] = useState([
    {
      id: 1,
      sender: "You",
      text: "No worries. It will be completed ASAP. I’ve asked him yesterday.",
      time: "19:32",
      textColor: "",
      bgColor: "",
    },
    {
      id: 2,
      sender: "Date",
      text: "Today June 09, 2021",
      time: "",
      textColor: "",
      bgColor: "",
    },
    {
      id: 3,
      sender: "Mary Hilda",
      text: "Hello Obaidullah, I will be your case advisor for case #029290. I have assigned some homework for you to fill. Please keep up with the due dates. Should you have any questions, you can message me anytime. Thanks.",
      time: "19:32",
      textColor: "text-orange-400",
      bgColor: "bg-orange-300",
    },
    {
      id: 4,
      sender: "You",
      text: "Please contact Mary for questions regarding the case bcs she will be managing your forms from now on! Thanks Mary.",
      time: "19:32",
      textColor: "",
      bgColor: "",
    },
    {
      id: 5,
      sender: "New",
      text: "New Message",
      time: "",
      textColor: "",
      bgColor: "",
    },
    {
      id: 6,
      sender: "Obaidullah Amarkhil",
      text: "Morning. I’ll try to do them. Thanks",
      time: "19:32",
      textColor: "text-teal-400",
      bgColor: "bg-teal-100",
    },
  ]);

  const addNewMessage = () => {
    if (!chatMessage.trim()) {
      setErrEmptyMessage("Please enter a message");
      return;
    }

    const message = {
      id: dataMessage.length + 1,
      sender: "You",
      text: chatMessage,
      time: format(new Date(), "HH:mm"),
      textColor: "",
      bgColor: "",
    };

    const updatedMessages = [...dataMessage, message];
    setDataMessage(updatedMessages);
    setChatMessage("");

    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 0);
  };

  return (
    <div
      ref={scrollRef}
      className="absolute bottom-24 right-8 w-[734px] h-[500px] bg-white rounded-xl overflow-x-hidden overflow-y-scroll"
    >
      {isLoading && <ChatLoading title="Loading Chats" />}
      {/* <div className="px-8">
        <div className="w-full px-4 py-2 rounded-lg border border-black flex items-center gap-4">
          <input
            type="text"
            placeholder="Search"
            className="w-full placeholder:text-primary-300 text-black text-base outline-0"
            onChange={handleSearch}
          />
          <Search size={16} />
        </div>

        {filteredMessages.length > 0 ? (
          filteredMessages.map((msg, index) => (
            <div
              key={index}
              className="flex gap-4 border-b py-4 last:border-0 cursor-pointer"
            >
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
      </div> */}

      {/* chat in index 0 */}
      <div>
        <div className="border-[#BDBDBD] border-b pb-5 sticky top-0 left-0 bg-white">
          <div className="flex items-center justify-between gap-3 px-6 pt-5">
            <button>
              <ArrowLeft />
            </button>
            <div className="flex-1 flex flex-col gap-2">
              <p className="text-base text-primary-100 font-semibold">
                I-589 - AMARKHIL, Obaidullah [Affirmative Filing with ZHN]
              </p>
              <p className="text-sm text-primary-500">3 Participants</p>
            </div>
            <button>
              <X />
            </button>
          </div>
        </div>
        <div className="py-3 px-6">
          {dataMessage.map((item) => {
            return item.sender === "You" ? (
              <ChatFromMe key={item.id} text={item.text} time={item.time} />
            ) : item.sender === "Date" ? (
              <Separator text={item.text} />
            ) : item.sender === "New" ? (
              <Separator isNewMessage text={item.text} />
            ) : (
              <ChatFromOther
                key={item.id}
                name={item.sender}
                text={item.text}
                time={item.time}
                textColor={item.textColor}
                bgColor={item.bgColor}
              />
            );
          })}
        </div>
        <div className="flex gap-3 px-6 pb-5 sticky bottom-0 left-0 bg-white">
          <div className="flex-1">
            <input
              type="text"
              name="chattext"
              value={chatMessage}
              onChange={(e) => {
                setChatMessage(e.target.value);
                setErrEmptyMessage("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addNewMessage();
                }
              }}
              className="w-full px-4 py-2 border border-primary-300 text-sm text-primary-500 rounded-sm"
              placeholder="Type a new message"
            />
            {errEmptyMessage && (
              <p className="text-red-500 text-xs mt-1">{errEmptyMessage}</p>
            )}
          </div>
          <Button onClick={addNewMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
}
