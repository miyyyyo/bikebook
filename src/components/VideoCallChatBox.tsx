import { SocketContext } from '@/context/VideoCallContext';
import React, { useContext } from 'react'

const VideoCallChatBox = () => {

    const context = useContext(SocketContext);

    if (!context) {
        throw new Error("You must use this component within a <ContextProvider>");
    }

    const { messages, message, sendMessage, setMessage } = context


    return (
        <>
            <div className="relative">
                <div className="mt-6 flex flex-col items-center overflow-y-auto justify-center z-0 relative ">
                    {messages && messages.map((e, i) => {
                        return (
                            <p className="bg-white w-full" key={i}>
                                <strong className="text-blue-500">{e.username}:</strong> {e.message}
                            </p>
                        )
                    })}
                </div>

            </div>
            <form 
            className="mt-6 flex items-center w-full justify-center sticky bottom-0"
            >
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="flex-grow p-2 border rounded-md focus:outline-none focus:border-blue-500"
                />

                <button
                    onClick={(e) => { e.preventDefault(); sendMessage() }}
                    type="submit"
                    className="ml-2 py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none"
                >
                    Enviar
                </button>
            </form>
        </>
    )
}

export default VideoCallChatBox