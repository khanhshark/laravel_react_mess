import TextInput from "@/Components/TextInput";
import ConsversationItem from "@/Components/App/ConversationItem";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";


const ChatLayout = ({ children }) => {
    const page = usePage();
    const conversations = page.props.conversations;
    const selectedConversations = page.props.selectedConvers;
    const [localConversations, setLocalConversations] = useState([]);
    const [sortedConversations, setSortedConversations] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState({});
    const isuserOnline = (userId) => onlineUsers[userId];
    const onsearch = (ev) =>{
        const search = ev.target.value ? ev.target.value.toLowerCase() : '';
        setLocalConversations(
            conversations.filter(
                (conversation) =>
                  
                    conversation.name.toLowerCase().includes(search)
            )
        );

    }

    console.log("conversations", conversations);
    console.log("selectedConversations", selectedConversations);

    useEffect(() => {
        setSortedConversations(
            localConversations.sort(
                (a, b) => {
            if (a.blocked_at && b.blocked_at) {
                return a.blocked_at > b.blocked_at ? -1 : 1;
            } else if (a.blocked_at) {
                return 1;
            } else if (b.blocked_at) {
                return -1;
            }
            //! ai nhắn cuối thì đứng đầu
            if (a.last_message_date && b.last_message_date) {
                return b.last_message_date.localeCompare(a.last_message_date); //! hàm so sánh linh hoạt
            }
            //! có nghĩa là a đứng trước b
            else if (a.last_message_date) {
                return -1;
            }
            //! 1 có nghĩa là b đứng trước a
            else if (b.last_message_date) {
                return 1;
            }
            //! 0 có nghĩa là a và b giữ nguyên
            else return 0;
        }
    )); 
    }, [localConversations]);
    useEffect(() => {
        setLocalConversations(conversations);
    }, [conversations]);

    useEffect(() => {
        // Tham gia kênh 'online' và xử lý sự kiện 'here' cũng như 'joining'
        const channel = Echo.join("online")
            .here((users) => {
                //! [[key1, value1], [key2, value2], ...] => {1: { name: "Alice", age: 25 },2: { name: "Bob", age: 30 }}
                const onlineUsersobj = Object.fromEntries(
                    users.map((user) => [user.id, user])
                ); //chuyển từ mảng (trong đó mỗi phần tử là một đối tượng người dùng) sang một đối tượng (object), với key là user.id và value là đối tượng người dùng tương ứng
                setOnlineUsers((prevOnlineUsers) => {
                    //!Nếu có key trùng lặp, thuộc tính từ đối tượng thứ hai (onlineUsersobj) sẽ ghi đè thuộc tính từ đối tượng thứ nhất (prevOnlineUsers).
                    return { ...prevOnlineUsers, ...onlineUsersobj };
                });
            })
            .joining((user) => {
                setOnlineUsers((prevOnlineUsers) => {
                    const updateUsers = { ...prevOnlineUsers }; //! coppy mảng
                    updateUsers[user.id] = user;
                    return updateUsers;
                });
            })
            .leaving((user) => {
                console.log("User left:", user);
            })
            .error((error) => {
                console.error("Error:", error); // Sử dụng console.error để xử lý lỗi
            });

        // Dọn dẹp khi thành phần bị unmount
        return () => {
            echo.leave("online");
        };
    }, []); // Chỉ chạy một lần khi thành phần được mount

    
    return <>
        <div className="flex-1 w-full flex overflow-hidden">
           <div className={`transition-all w-full sm:w-[220px] md :w-[300px] bg-slate-800
            flex flex-col overflow-hidden ${selectedConversations? "-ml-[100%] sm:ml-0" : ""}
            `}>
                <div className="flex items-center justify-between py-2 px-3 text-xl font-medium">
                    My Converations
                    <div className="tooltip tooltip-left" data-tip ="Create new Group">
                    <button className="text-gray-400 hover:text-gray-200" >
                        <PencilSquareIcon className="w-4 h-4 inline-block ml-2"/>
                    </button>
                    </div>
                </div>
                <div className="p-3">
                    <TextInput onKeyUp={onsearch} placeholder="Filter users and groups" className="w-full"/>
                </div>
                <div  className="flex-1 overflow-auto">
                    {sortedConversations  &&  sortedConversations.map(conversation =>(
                      
                        <ConsversationItem 
                        key={`${conversation.is_group ? "group_" : "user_"}${conversation.id}`} 
                        Conversation={conversation} 
                        online={!!isuserOnline(conversation.id)} 
                      />
                      
                    ))}
                </div>
           </div>
           <div className="flex-1 flex flex-col overflow-hidden">
            {children}
           </div>
        </div>
    
    
    </>;
};

export default ChatLayout; // Đảm bảo xuất component ra để có thể import ở các nơi khác
