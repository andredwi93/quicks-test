import { format } from "date-fns";
import { ArrowLeft, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ChatFromMe from "~/components/bubbles-chat/FromMe";
import ChatFromOther from "~/components/bubbles-chat/FromOther";
import Separator from "~/components/bubbles-chat/Separator";
import { Button } from "~/components/ui/button";
import { dataMultipleChats } from "~/lib/data-multichat";

export default function MultipleUserChat({ onClose }: { onClose: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [errEmptyMessage, setErrEmptyMessage] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [isEditMessage, setIsEditMessage] = useState(false);
  const [idMessage, setIdMessage] = useState<number | null>();
  const [dataMessage, setDataMessage] = useState(dataMultipleChats);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 100;
      setIsAtBottom(atBottom);
    };

    const checkNewMessage = dataMessage.filter((msg) => msg.sender === "New");
    if (checkNewMessage.length > 0) {
      setHasNewMessage(true);
    } else {
      setHasNewMessage(false);
    }

    const scrollEl = scrollRef.current;

    if (scrollEl) {
      scrollEl.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollEl) {
        scrollEl.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    if (isAtBottom) {
      setHasNewMessage(false);
    }
  }, [isAtBottom]);

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
      isReply: replyMessage ? true : false,
      replyMessage: replyMessage,
    };

    const updatedMessages = [...dataMessage, message];
    setDataMessage(updatedMessages);
    setChatMessage("");
    setReplyMessage("");

    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 0);
  };

  const handleDeleteMessage = (id: number) => {
    const updatedMessages = dataMessage.filter((msg) => msg.id !== id);
    setDataMessage(updatedMessages);
  };

  const handleUpdateMessage = (id: number, text: string) => {
    const updateMessage = dataMessage.map((msg) =>
      msg.id === id ? { ...msg, text, time: format(new Date(), "HH:mm") } : msg
    );
    setChatMessage("");
    setIsEditMessage(false);
    setIdMessage(null);
    setDataMessage(updateMessage);
  };

  return (
    <div
      ref={scrollRef}
      className="absolute bottom-24 right-0 md:right-8 w-[320px] md:w-[734px] h-[500px] bg-white rounded-xl overflow-x-hidden overflow-y-scroll"
    >
      <div className="border-[#BDBDBD] border-b pb-5 sticky top-0 left-0 bg-white">
        <div className="flex items-center justify-between gap-3 px-6 pt-5">
          <button className="cursor-pointer" onClick={onClose}>
            <ArrowLeft />
          </button>
          <div className="flex-1 flex flex-col gap-2">
            <p className="text-base text-primary-100 font-semibold">
              I-589 - AMARKHIL, Obaidullah [Affirmative Filing with ZHN]
            </p>
            <p className="text-sm text-primary-500">3 Participants</p>
          </div>
          <button className="cursor-pointer" onClick={onClose}>
            <X />
          </button>
        </div>
      </div>
      <div className="py-3 px-6">
        {dataMessage.map((item) => {
          return item.sender === "You" ? (
            <ChatFromMe
              key={item.id}
              text={item.text}
              time={item.time}
              textReply={item.replyMessage}
              isReply={item.isReply}
              onClickEdit={() => {
                setChatMessage(item.text);
                setIsEditMessage(true);
                setIdMessage(item.id);
              }}
              onClickDelete={() => handleDeleteMessage(item.id)}
            />
          ) : item.sender === "Date" ? (
            <Separator key={item.id} text={item.text} />
          ) : item.sender === "New" ? (
            <Separator key={item.id} isNewMessage text={item.text} />
          ) : (
            <ChatFromOther
              key={item.id}
              name={item.sender}
              text={item.text}
              time={item.time}
              textColor={item.textColor}
              bgColor={item.bgColor}
              onReply={() => setReplyMessage(item.text)}
            />
          );
        })}
      </div>
      {hasNewMessage && !isAtBottom && (
        <button
          onClick={() => {
            if (scrollRef.current) {
              scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
            setHasNewMessage(false);
          }}
          className="sticky bottom-20 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#E9F3FF] text-primary-100 rounded shadow z-20"
        >
          New Message
        </button>
      )}

      <div className="flex gap-3 px-6 pb-5 sticky bottom-0 left-0 bg-white">
        <div className="flex-1 flex-col">
          {replyMessage && (
            <div className="bg-[#F8F8F8] relative rounded-tl-sm rounded-tr-sm border border-primary-300 flex-1 flex flex-col gap-2 p-[10px]">
              <p className="text-sm font-medium text-primary-400">
                {replyMessage}
              </p>
              <div
                className="absolute top-2 right-2"
                onClick={() => setReplyMessage("")}
              >
                <X size={12} />
              </div>
            </div>
          )}
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
                if (isEditMessage) {
                  handleUpdateMessage(idMessage!, chatMessage);
                } else {
                  addNewMessage();
                }
              }
            }}
            className={`w-full px-4 py-2 border border-primary-300 text-sm text-primary-500 ${
              replyMessage ? "rounded-bl-sm rounded-br-sm" : "rounded-sm"
            }`}
            placeholder="Type a new message"
          />
          {errEmptyMessage && (
            <p className="text-red-500 text-xs mt-1">{errEmptyMessage}</p>
          )}
        </div>
        <Button
          onClick={() => {
            if (isEditMessage) {
              handleUpdateMessage(idMessage!, chatMessage);
            } else {
              addNewMessage();
            }
          }}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
