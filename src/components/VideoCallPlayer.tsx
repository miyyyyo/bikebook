import React, { useContext } from 'react';
import { SocketContext } from "../hooks/VideoCallContext"

const VideoCallPlayer: React.FC = () => {


    const context = useContext(SocketContext);

    if (!context) {
        throw new Error("You must use VideoPlayer within a <ContextProvider>");
    }

    const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } = context;


    return (
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
            {stream && (
                <div className="border-2 border-black p-4">
                    <h5 className="text-lg mb-4">{name || 'Name'}</h5>
                    <video playsInline muted ref={myVideo} autoPlay className="w-72 md:w-144 rounded-md shadow-md" />
                </div>
            )}
            {callAccepted && !callEnded && (
                <div className="border-2 border-black p-4">
                    <h5 className="text-lg mb-4">{call.name || 'Name'}</h5>
                    <video playsInline ref={userVideo} autoPlay className="w-72 md:w-144 rounded-md shadow-md" />
                </div>
            )}
        </div>
    );
};

export default VideoCallPlayer;
