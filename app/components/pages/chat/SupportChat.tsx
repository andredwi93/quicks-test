import { format } from "date-fns";
import { ArrowLeft, X } from "lucide-react";
import { useRef, useState } from "react";
import ChatFromMe from "~/components/bubbles-chat/FromMe";
import ChatFromOther from "~/components/bubbles-chat/FromOther";
import { Button } from "~/components/ui/button";

export default function SupportChat({ onClose }: { onClose: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [errEmptyMessage, setErrEmptyMessage] = useState("");
  const [isEditMessage, setIsEditMessage] = useState(false);
  const [waitSupport, setWaitSupport] = useState(false);
  const [idMessage, setIdMessage] = useState<number | null>();
  const [dataMessage, setDataMessage] = useState([
    {
      id: 1,
      sender: "FastVisa Support",
      text: "Hey there. Welcome to your inbox! Contact us for more information and help about anything! We’ll send you a response as soon as possible.",
      time: "19:32",
      textColor: "text-primary-100",
      bgColor: "bg-[#F8F8F8]",
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

    if (dataMessage.length < 2) {
      setWaitSupport(true);

      setTimeout(() => {
        setWaitSupport(false);
        const message = {
          id: Date.now(),
          sender: "FastVisa Support",
          text: "What can I help you with?",
          time: format(new Date(), "HH:mm"),
          textColor: "text-primary-100",
          bgColor: "bg-[#F8F8F8]",
        };

        setDataMessage((prev) => [...prev, message]);
      }, 2000);
    } else {
      setWaitSupport(false);
    }
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
              FastVisa Support
            </p>
          </div>
          <button className="cursor-pointer" onClick={onClose}>
            <X />
          </button>
        </div>
      </div>
      <div className="h-full py-3 px-6">
        {dataMessage.map((item) => {
          return item.sender === "You" ? (
            <ChatFromMe
              key={item.id}
              text={item.text}
              time={item.time}
              onClickEdit={() => {
                setChatMessage(item.text);
                setIsEditMessage(true);
                setIdMessage(item.id);
              }}
              onClickDelete={() => handleDeleteMessage(item.id)}
            />
          ) : (
            <ChatFromOther
              key={item.id}
              name={item.sender}
              text={item.text}
              time={item.time}
              textColor={item.textColor}
              bgColor={item.bgColor}
              isOption={false}
            />
          );
        })}
      </div>

      {waitSupport && (
        <div className="px-6 sticky bottom-16 left-0">
          <div className="flex items-center gap-3 bg-blue-100 rounded-lg p-[10px]">
            <div>
              <svg
                width="35"
                height="35"
                viewBox="0 0 35 35"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="animate-spin"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.17128 24.3748L27.2356 10.0322L27.277 10.0902C27.2633 10.0708 27.2496 10.0515 27.2358 10.0322C23.2752 4.49158 15.5729 3.21073 10.0322 7.17136C4.49162 11.132 3.21075 18.8342 7.17128 24.3748Z"
                  fill="#2F80ED"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.17135 24.3749C7.17137 24.3749 7.17139 24.3749 7.17141 24.3749C11.132 29.9156 18.8344 31.1964 24.375 27.2358C29.9156 23.2752 31.1965 15.5729 27.2359 10.0322C27.2241 10.0157 27.2122 9.99924 27.2004 9.98282L27.2357 10.0322L7.17135 24.3749Z"
                  fill="#F8F8F8"
                />
                <path
                  d="M10.4407 23.7204C10.4407 24.6705 9.67048 25.4407 8.72036 25.4407C7.77023 25.4407 7 24.6705 7 23.7204C7 22.7702 7.77023 22 8.72036 22C9.67048 22 10.4407 22.7702 10.4407 23.7204Z"
                  fill="#2F80ED"
                />
                <path
                  d="M27.5257 10.9768C27.5257 11.9269 26.7554 12.6972 25.8053 12.6972C24.8552 12.6972 24.085 11.9269 24.085 10.9768C24.085 10.0267 24.8552 9.25644 25.8053 9.25644C26.7554 9.25644 27.5257 10.0267 27.5257 10.9768Z"
                  fill="#2F80ED"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.74389 22.5362C12.689 26.6561 18.4163 27.6086 22.5363 24.6635C26.6563 21.7184 27.6087 15.991 24.6636 11.8711C21.7185 7.75109 15.9912 6.79866 11.8712 9.74374C7.75123 12.6888 6.7988 18.4162 9.74389 22.5362Z"
                  fill="#E9F3FF"
                />
              </svg>
            </div>
            <p className="text-sm md:text-base text-primary-400 font-semibold">
              Please wait while we connect you with one of our team ...
            </p>
          </div>
        </div>
      )}
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
                if (isEditMessage) {
                  handleUpdateMessage(idMessage!, chatMessage);
                } else {
                  addNewMessage();
                }
              }
            }}
            className="w-full px-4 py-2 border border-primary-300 text-sm text-primary-500 rounded-sm"
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
