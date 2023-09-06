import React, { useState, useContext } from 'react';
import { SocketContext } from '../hooks/VideoCallContext';

type SidebarProps = {
    children: React.ReactNode;
};

const VideoCallSidebar: React.FC<SidebarProps> = ({ children }) => {

    const context = useContext(SocketContext);

    if (!context) {
        throw new Error("You must use VideoPlayer within a <ContextProvider>");
    }

    const { callAccepted, callEnded, leaveCall, callUser } = context;
    const [idToCall, setIdToCall] = useState('');

    return (
        <div className="flex justify-center p-8">
            <div className="border-2 border-black p-6 rounded-md shadow-lg w-full max-w-xl">
                <form className="flex flex-col">
                    <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
                        <div className="flex flex-col space-y-4">
                            <h6 className="text-lg font-medium">Make a call</h6>
                            <input
                                type="text"
                                placeholder="ID to call"
                                value={idToCall}
                                onChange={(e) => setIdToCall(e.target.value)}
                                className="border p-2 rounded-md"
                            />
                            {callAccepted && !callEnded ? (
                                <button
                                    onClick={(e) => { e.preventDefault(); leaveCall()}}
                                    className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 focus:outline-none"
                                >
                                    Hang Up
                                </button>
                            ) : (
                                <button
                                    onClick={(e) => {e.preventDefault(); callUser(idToCall)}}
                                    className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none"
                                >
                                    Call
                                </button>
                            )}
                        </div>
                    </div>
                </form>
                {children}
            </div>
        </div>
    );
};

export default VideoCallSidebar;
