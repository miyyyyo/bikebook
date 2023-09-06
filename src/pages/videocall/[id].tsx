import React, { useEffect, useState, useRef, useContext } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import io, { Socket } from 'socket.io-client';
import { SocketContext } from '@/hooks/VideoCallContext';
import VideoCallPlayer from '@/components/VideoCallPlayer';
import VideoCallNotification from '@/components/VideoCallNotification';
import VideoCallSidebar from '@/components/VideoCallSideBar';

type ChatMessage = {
    username: string;
    message: string;
    timestamp?: Date;
};

type UserInRoom = {
    username: string;
    id: string;
    room: string;
}

const Videocall = () => {

    const router = useRouter();
    const roomId = router.query.id;

    const context = useContext(SocketContext);

    if (!context) {
        throw new Error("You must use this component within a <ContextProvider>");
    }

    const { me, name } = context
    // const [username, setUsername] = useState("Luis");
    const [message, setMessage] = useState(''); // For the user's message input
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [usersInRoom, setUsersInRoom] = useState<UserInRoom[]>([]);


    // const socket = useRef<Socket | null>(null);
    
    // useEffect(() => {
    
    //     // Set the username and name
    //     setUsername(session?.user?.name as string);
    //     setName(session?.user?.name as string);
    
    //     // Join the room if roomId and username are set
    //     if (roomId && me) {
    //         console.log(me, roomId)
    //         socket.current?.emit('join_room', { username: me, room: roomId });
    //         console.log("joined");
    //     }
    
    //     // Set up event listeners
    //     socket.current?.on('users_in_room', (users) => {
    //         setUsersInRoom(users);
    //     });
    
    //     socket.current?.on('new_message', (data) => {
    //         setChatMessages((prev) => [...prev, data]);
    //     });
    
    //     // Emit get_users_in_room event
    //     socket.current?.emit('get_users_in_room', roomId);
    
    //     // Clean up event listeners and disconnect the socket when the component unmounts
    //     return () => {
    //         socket.current?.off('users_in_room');
    //         socket.current?.off('new_message');
    //         socket.current?.disconnect();
    //     };
    
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [roomId, username]);



    if (
        // !session || 
        !roomId) {
        return <p>Cargando...</p>;
    }

    return (
        <div className="p-12 bg-gray-100 min-h-screen">

            <button onClick={(e) => { e.preventDefault(); console.log("NAME:",name,"ME:", me, "USERSINROOM", usersInRoom) }}>
                LoG
            </button>


            <VideoCallPlayer />

            <VideoCallSidebar>
                <VideoCallNotification />
            </VideoCallSidebar>

            <div className="chat-display mt-6 border p-4 bg-white rounded-md">
                {chatMessages.map((msg, index) => (
                    <div key={index} className="mb-2">
                        <strong className="text-blue-500">{msg.username}</strong>: {msg.message}
                    </div>
                ))}
            </div>

            <div className="users-list mt-6 border p-4 bg-white rounded-md">
                <h3 className="text-xl mb-4">Users in Room:</h3>
                {usersInRoom.map((user, index) => (
                    <div key={index} className="mb-2">
                        <span className="text-blue-500">{user.username}</span>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex items-center">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-grow p-2 border rounded-md focus:outline-none focus:border-blue-500"
                />
                {/* <button
                    onClick={sendMessage}
                    className="ml-2 py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none"
                >
                    Send
                </button> */}
            </div>
        </div>

    );
};

export default Videocall;
