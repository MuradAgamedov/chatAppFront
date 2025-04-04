// ChatItem.jsx
const ChatItem = ({ avatar, name, text, time }) => {
    return (
        <div className="px-3 flex items-center bg-grey-light cursor-pointer">
            <div>
                <img className="h-12 w-12 rounded-full" src={avatar} alt={name} />
            </div>
            <div className="ml-4 flex-1 border-b border-grey-lighter py-4">
                <div className="flex items-bottom justify-between">
                    <p className="text-grey-darkest font-bold">{name}</p>
                    <p className="text-xs text-grey-darkest">{time}</p>
                </div>
                <p className="text-grey-dark mt-1 text-sm">{text}</p>
            </div>
        </div>
    );
};

export default ChatItem;
