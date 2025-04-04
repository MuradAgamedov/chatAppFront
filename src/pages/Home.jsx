// src/pages/Home.jsx
import { useState } from "react";
import ChatList from "../components/ChatContent/ChatList.jsx";
import MessageList from "@/components/MessageContent/MessageList.jsx";

const Home = () => {
    const [selectedUser, setSelectedUser] = useState(null);

    return (
        <div className="container mx-auto" style={{ marginTop: "-128px" }}>
            <div className="py-6 min-h-screen">
                <div className="flex flex-col md:flex-row border border-grey-lighter rounded shadow-lg h-full">
                    <ChatList onSelectUser={setSelectedUser} />

                    {!selectedUser && (
                        <div className="w-full md:w-2/3 flex items-center justify-center" style={{ height: "100vh", backgroundColor: "#f9f9f9" }}>
                            <p className="text-xl text-gray-600 font-semibold text-center px-4">
                             Найдите себе собеседника и начните переписку  ✨
                            </p>
                        </div>
                    )}

                    {selectedUser && <MessageList user={selectedUser} />}
                </div>
            </div>
        </div>
    );
};

export default Home;
