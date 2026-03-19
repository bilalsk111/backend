import { initSocketConnection } from "../services/chat.socket";
import { sendMessage, getChats, getMessages, delChat,createChat } from "../services/chat.api";
import { setChats, setLoading, setError, setCurrentChatId, createNewChat, addNewMessage,addMessages,replaceTempIdWithReal } from "../chat.slice";
import { useDispatch } from "react-redux";

export function useChat() {
    const dispatch = useDispatch();

const handleSendMessage = async ({ message, chatId }) => {
    dispatch(addNewMessage({
        chatId,
        content: message,
        role: "user"
    }));

    dispatch(setLoading(true));

    try {
        const { aimessage } = await sendMessage({ message, chatId });

        if (aimessage?.content) {
            dispatch(addNewMessage({
                chatId,
                content: aimessage.content,
                role: "ai"
            }));
        }

    } catch (err) {
        dispatch(setError(err.message));
    } finally {
        dispatch(setLoading(false));
    }
};

 async function handleGetChats() {
dispatch(setLoading(true))
const data = await getChats()
const {chats} = data
dispatch(setChats(chats.reduce((acc,chat)=>{
  acc[chat._id] = {
        id:chat._id,
        title:chat.title,
        messages:[],
        lastUpdated:chat.updateAt,
    }
    return acc
},{})))
dispatch(setLoading(false))
}

async function handleOpenChat(chatId) {
    if (!chatId) return;

    dispatch(setCurrentChatId(chatId)); // ✅ move this UP

    try {
        const data = await getMessages(chatId);

        const formattedMessages = (data.messages || []).map((msg, index) => ({
            id: index,
            content: msg.content,
            role: msg.role
        }));

        dispatch(addMessages({
            chatId,
            messages: formattedMessages
        }));

    } catch (err) {
        // ✅ don't break UI if no messages
        dispatch(addMessages({
            chatId,
            messages: []
        }));
    }
}

const handleNewChat = async () => {
    dispatch(setLoading(true));

    try {
        const { chat } = await createChat();

        dispatch(createNewChat({
            chatId: chat._id,
            title: chat.title
        }));

        setTimeout(() => {
            dispatch(setCurrentChatId(chat._id));
        }, 0);

    } catch (err) {
        dispatch(setError(err.message));
    } finally {
        dispatch(setLoading(false));
    }
};
    return {
        initSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChat,
        handleNewChat
    };
}