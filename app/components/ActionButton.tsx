type ActionButtonProps = {
  onClick?: () => void;
  isOpen?: boolean;
  isActive?: boolean;
  children: React.ReactNode;
  isChat?: boolean;
  isTodo?: boolean;
};

export default function ActionButton({
  onClick,
  isOpen,
  isActive,
  children,
  isChat,
  isTodo,
}: ActionButtonProps) {
  return (
    <div
      className={`transition-transform duration-300 ${
        isOpen ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
      }`}
    >
      <div
        className={`relative ${
          isActive ? "flex justify-end w-[76px]" : "w-fit"
        }`}
      >
        <button
          className={`${
            isActive
              ? isChat
                ? "bg-purple-400"
                : isTodo
                ? "bg-orange-400"
                : "bg-gray"
              : "bg-gray"
          } ${
            isActive ? "w-[68px] h-[68px]" : "w-[60px] h-[60px]"
          } rounded-full shadow-lg flex items-center justify-center z-10 cursor-pointer`}
          onClick={onClick}
        >
          {children}
        </button>
        {isActive && (
          <div className="absolute top-0 left-0 w-[68px] h-[68px] bg-primary-300 rounded-full"></div>
        )}
      </div>
    </div>
  );
}
