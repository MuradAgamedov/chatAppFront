const Header = ({ user, isTyping, isOnline, apiUrl }) => {
    return (
        <div className="py-2 px-3 bg-grey-lighter flex items-center">
            <img
                className="w-10 h-10 rounded-full"
                src={user.avatarUrl ? `${apiUrl}${user.avatarUrl}` : "default-avatar.png"}
                alt="chat avatar"
            />
            <div className="ml-4">
                <p className="text-grey-darkest">{user.fullName || user.userName}</p>
                {isTyping ? (
                    <p className="text-red-500 text-xs italic">... yazır</p>
                ) : isOnline ? (
                    <p className="text-green-600 text-xs font-bold">Online</p>
                ) : null}
            </div>
        </div>
    );
};

export default Header;
