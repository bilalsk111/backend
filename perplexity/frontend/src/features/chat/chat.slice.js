import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: {},
        currentChatId: null,
        isLoading: false,
        error: null
    },
    reducers: {
        createNewChat: (state, action) => {
            const { chatId, title } = action.payload
            state.chats[chatId] = {
                id: chatId,
                title,
                messages: [],
                lastUpdated: new Date().toISOString(),
            }
        },
        addNewMessage: (state, action) => {
            const { chatId, content, role } = action.payload;

            const newMsg = {
                id: Date.now(),
                content,
                role
            };

            if (state.chats[chatId]) {
                state.chats[chatId].messages.push(newMsg);
            } else {
                state.chats[chatId] = {
                    id: chatId,
                    messages: [newMsg],
                    lastUpdated: new Date().toISOString()
                };
            }
        },
        addMessages: (state, action) => {
            const { chatId, messages } = action.payload;
            if (state.chats[chatId]) {
                state.chats[chatId].messages = messages;
            }
        },
        setChats: (state, action) => {
            state.chats = action.payload
        },
        replaceTempIdWithReal: (state, action) => {
            const { tempId, realId, title } = action.payload;
            if (state.chats[tempId]) {
                state.chats[realId] = {
                    ...state.chats[tempId],
                    id: realId,
                    title: title || state.chats[tempId].title
                };
                delete state.chats[tempId];
            }
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        }
    }
})

export const { setChats, setCurrentChatId, setError, setLoading, createNewChat, addNewMessage, addMessages, replaceTempIdWithReal } = chatSlice.actions
export default chatSlice.reducer

// chats = {
//     "docker and Aws":{
//         messages:[
//             {
//                 role:"user",
//                 content:"what is docker",
//             },
//             {
//                 role:"ai",
//                 content:"Docker is a platform that allow developres to autocomplete"
//             }
//         ],
//         id:"docker and AWS",
//         lastUpadte:"2024-06-20t112:34:56z",
//     }
// }