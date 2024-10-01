export interface User {
    supabaseId: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface Chatroom {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    owner: User;
}

export interface Message {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    sentBy?: User;
    chatRoomId: string;
}