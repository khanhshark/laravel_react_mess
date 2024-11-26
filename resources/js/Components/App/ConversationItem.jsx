import { Link, usePage } from "@inertiajs/react";
import UserAvatar from "./UserAvatar";
import GroupAvatar from "./GroupAvatar";
import UserOptionsDropdown from "./UserOptionsDropdown";

const ConversationItem = ({
    Conversation,
    selectedConversation = null,
    online = null,
}) => {
    const page = usePage();
    const currentUser = page.props.auth.user;
    let classes = "border-transparent"; //  màu viền (border) thành màu trong suốt.
    if (selectedConversation) {
        if (
            !selectedConversation.is_group &&
            !Conversation.is_group &&
            selectedConversation.id == Conversation.id
        ) {
            classes = "border-blue-500 bg-black/20";
        }
        if (
            selectedConversation.is_group &&
            Conversation.is_group &&
            selectedConversation.id == Conversation.id
        ) {
            classes = "border-blue-500 bg-black/20";
        }
    }
    return (
        <Link
            href={
                Conversation.is_group
                    ? route("chat.group", Conversation)
                    : route("chat.user", Conversation)
            }
            preserveState
            className={
                "conversation-item flex items-center gap-2 p-2 text-gray-300 transition-all cursor-pointer border-1-4 hover:bg:black/30" +
                classes +
                (Conversation.is_user && currentUser.is_admin ? "pr-2" : "pr-4")
            }
        >
            {Conversation.is_user && (
                <UserAvatar use={Conversation} online={online} />
            )}
            {Conversation.is_user && <GroupAvatar />}
            //! nếu người dùng bị chặn mờ xuống
            <div className={`flex-1 text-xs max-w-full overflow-hidden `
            + (Conversation.is_user && currentUser.blocked_at ?"opacity-50":"")
            }>

            <div className="{`flex-1 gap-1 justify-between items-center`}">
                <h3 className="text-sm font-semibold overflow-hidden text-nowrap text-ellipsis">
                    {Conversation.name}
                </h3>
               
                    {Conversation.last_message_date && (
                        <span className="text-nowrap">
                            {Conversation.last_message_date}
                        </span>
                    )}
                        
               
            </div>
            {Conversation.last_message && (
                    <p className="text-sm font-semibold overflow-hidden text-nowrap text-ellipsis">
                        {Conversation.last_message.message}
                    </p>
                )}
            </div>
              {currentUser.is_user && currentUser.is_admin &&(
                <UserOptionsDropdown conversation={Conversation} />
              )}      
        </Link>
    );
};
