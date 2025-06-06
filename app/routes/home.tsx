import { useState } from "react";
import ActionButton from "~/components/ActionButton";
import type { Route } from "./+types/home";
import ChatComponent from "~/components/pages/ChatComponents";
import { ChatIcon, TodoIcon } from "~/components/Icons";
import TodoComponents from "~/components/pages/TodoComponents";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Quicks App" },
    { name: "description", content: "Welcome to Quicks App!" },
  ];
}

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenPage, setIsOpenPage] = useState<number | null>(null);
  const [isChatPage, setIsChatPage] = useState(false);
  const [isTodoPage, setIsTodoPage] = useState(false);

  return (
    <main className="relative h-screen overflow-hidden">
      <div className="fixed bottom-8 right-8 w-fit h-[68px]">
        {isChatPage && <ChatComponent />}
        {isTodoPage && <TodoComponents />}
        <div
          className={`flex items-center ${
            isOpenPage !== null ? "gap-4" : "gap-[26px]"
          }`}
        >
          {Array.from({ length: 2 }).map((_, index) => (
            <ActionButton
              isOpen={isOpen}
              key={index}
              isActive={isOpenPage === null ? false : index === 1}
              isChat={isChatPage}
              isTodo={isTodoPage}
              onClick={() => {
                if (index === 0) {
                  setIsChatPage(false);
                  setIsTodoPage(true);
                  if (isOpenPage === null) {
                    setIsOpenPage(0);
                  } else if (isOpenPage === 1) {
                    setIsOpenPage(0);
                  } else {
                    setIsChatPage(true);
                    setIsTodoPage(false);
                    setIsOpenPage(1);
                  }
                } else {
                  if (isOpenPage === null) {
                    setIsChatPage(true);
                    setIsTodoPage(false);
                    setIsOpenPage(1);
                  }
                }
              }}
            >
              {index === 0 && (isOpenPage === 0 ? <ChatIcon /> : <TodoIcon />)}
              {index === 1 &&
                (isOpenPage === 0 ? (
                  <TodoIcon isActive={true} />
                ) : (
                  <ChatIcon isActive={isChatPage} />
                ))}
            </ActionButton>
          ))}

          {isOpenPage === null && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-primary-100 cursor-pointer w-[68px] h-[68px] rounded-full flex items-center justify-center transition-transform hover:scale-105"
            >
              <svg
                width="56"
                height="56"
                viewBox="0 0 56 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M31.4427 12.3359C32.3618 12.9486 32.6101 14.1904 31.9974 15.1094L24.737 26H35C35.7376 26 36.4153 26.406 36.7634 27.0563C37.1114 27.7066 37.0732 28.4957 36.6641 29.1094L27.3308 43.1094C26.7181 44.0285 25.4763 44.2768 24.5573 43.6641C23.6382 43.0514 23.3899 41.8097 24.0026 40.8906L31.263 30H21C20.2624 30 19.5847 29.5941 19.2367 28.9437C18.8886 28.2934 18.9268 27.5043 19.3359 26.8906L28.6692 12.8906C29.2819 11.9716 30.5237 11.7232 31.4427 12.3359Z"
                  fill="white"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
