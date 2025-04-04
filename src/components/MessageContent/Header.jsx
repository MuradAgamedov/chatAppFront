import { Link } from "react-router-dom";

const Header = ({ user, isTyping, isUserOnline, apiUrl }) => {
  return (
    <div className="py-2 px-3 bg-grey-lighter flex items-center">
      <img
        className="w-10 h-10 rounded-full"
        src={user.avatarUrl ? `${apiUrl}${user.avatarUrl}` : "default-avatar.png"}
        alt="chat avatar"
      />
      <div className="ml-4">
        <p className="text-grey-darkest font-semibold">
          <Link to={`/status/user/${user?.email}`} className="hover:underline">
            {user.fullName || user.userName}
          </Link>
        </p>

        {isTyping ? (
          <p className="text-sm text-white bg-red-500 px-2 py-0.5 rounded inline-block mt-0.5">
            ... пишет
          </p>
        ) : isUserOnline ? (
          <p className="text-sm text-white bg-green-600 px-2 py-0.5 rounded inline-block mt-0.5">
            Online
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default Header;
