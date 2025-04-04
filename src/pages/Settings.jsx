import ChatList from '../components/ChatContent/ChatList.jsx';
import MessageList from "@/components/MessageContent/MessageList.jsx";
import SettingsForm from "@/components/SettingsForm.jsx";
const Settings = () => {


    return (
        <div className="container mx-auto" style={{marginTop: "-128px"}}>
            <div className="py-6 min-h-screen">
                <div className="flex flex-col md:flex-row border border-grey-lighter rounded shadow-lg h-full">
                    <SettingsForm/>
                </div>
            </div>
        </div>
    );
};

export default Settings;
