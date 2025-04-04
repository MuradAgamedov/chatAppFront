// src/components/ChatContent/ChatList.jsx
import { useState, useEffect } from "react";
import LeftSectionHeader from "@/components/LeftSectionHeader.jsx";
import ChatItem from "./ChatItem.jsx";
const apiUrl = import.meta.env.VITE_API_URL;

const ChatList = ({ onSelectUser }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const defaultMessage = "";

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(apiUrl+"/api/User/all");
                const data = await response.json();
                const currentUserEmail = JSON.parse(localStorage.getItem("user") || '""');

                const filteredUsers = data.filter(user => user.email !== currentUserEmail?.user?.email);
                setAllUsers(filteredUsers);
            } catch (error) {
                console.error("Ошибка при загрузке пользователей:", error);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = allUsers.filter(user => {
        const name = (user.fullName || user.userName || "").toLowerCase();
        return name.includes(searchTerm.toLowerCase());
    });

    return (
        <div className="w-full md:w-1/3 border flex flex-col">
            <LeftSectionHeader />

            <div className="py-2 px-2 bg-grey-lightest">
                <input
                    type="text"
                    className="w-full px-2 py-2 text-sm"
                    placeholder="Поиск пользователей"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-grey-lighter flex-1 overflow-auto">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <div key={user.id} onClick={() => onSelectUser(user)} className="cursor-pointer hover:bg-gray-100">
                            <ChatItem
                                avatar={user.avatarUrl ? apiUrl + user.avatarUrl : "default-avatar.png"}
                                name={user.fullName || user.userName}
                                text={defaultMessage}
                                time={""}
                            />
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 mt-4">Пользователи не найдены</p>
                )}
            </div>
        </div>
    );
};

export default ChatList;
